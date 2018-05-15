import React, { Component } from 'react';
import './marketplace.css';


class Marketplace extends Component {
    render(props) {
        return (
            <div className="marketplace">
                 <Box conversation={[{message: "testing", avatar: "http://eightbitavatar.herokuapp.com/?id=userid&s=male&size=400", alignment: 'right' }, {message: "testing response", avatar: "http://eightbitavatar.herokuapp.com/?id=userid&s=male&size=400", alignment: 'left' }]}/>
            </div>
        );
    }
}

export default Marketplace;