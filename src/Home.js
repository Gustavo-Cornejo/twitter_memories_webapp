import React from 'react';
import './Home.css';
import Welcome from './Welcome';
import Upload from './Upload'
import Feed from './Feed'
import axios from 'axios';
import Navigation from './Navigation';

// TODO: Implement File upload component 
// feed if file status is 2, file upload if 1, welcome if isLoggedIn is false

class Home extends React.Component {

    constructor(props) {
        super(props);

        const tokens_exist = localStorage.getItem('access-token') && localStorage.getItem('refresh-token');
        
        this.getFeed = this.getFeed.bind(this);
        this.getCurrentDate = this.getCurrentDate.bind(this);
        this.rerenderParentCallback = this.rerenderParentCallback.bind(this);

        this.state = {
            isLoggedIn : tokens_exist,
            file_status : null,
            tweets: []
        }
    }

    getCurrentDate () {
        let curr_date = new Date();
        let months = [
            'Jan', 
            'Feb', 
            'Mar', 
            'Apr', 
            'May', 
            'Jun', 
            'Jul', 
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ]
        return [
            months[curr_date.getMonth()], 
            curr_date.getDate()
        ]
    }

    rerenderParentCallback () {
        // we can either call set state or do forceUpdate
        console.log('1234556667656');
        this.forceUpdate();
    }


    getFeed () {
        const config = {
            params: {
                "month": this.getCurrentDate()[0], "date": this.getCurrentDate()[1]
            },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }
        }
        axios.get(
            process.env.REACT_APP_URL + '/feed',
            config
        ).then( (response) => {
            // without this logic, it will trigger an infinite loop bc it will set state and trigger component did update
            if (response.data['file_status'] != this.state.file_status){
                this.setState({ file_status: response.data['file_status'], tweets: response.data['tweets'] });
            }
            console.log('the file status is: ' +  this.state.file_status.toString());
        })
    }


    componentDidUpdate () {
        // here we need to replicate logic of component did mount 
        this.getFeed();
    }

    componentDidMount () {
        // call the endpoint to get file status and use it to conditionally render components
        this.getFeed();
    }

    
    render () {

        const isLoggedIn = this.state.isLoggedIn;
        const file_status = this.state.file_status;
        console.log(file_status)

        return (
            <div>
                <Navigation display={true}/>
                <div className="parent">
                    {isLoggedIn ? file_status == 0 ? <Upload parentCallback={this.rerenderParentCallback}/> : <Feed file_status={this.state.file_status} tweets={this.state.tweets}/> : <Welcome/>}
                </div>
            </div>
        );
    }


}

export default Home;