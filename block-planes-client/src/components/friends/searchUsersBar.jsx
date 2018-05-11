import _ from 'lodash';
import React, { Component } from 'react';
import { Search, Grid, Header } from 'semantic-ui-react';
import axios from 'axios';


class SearchUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: '',
      value: '',
      results: '',
      users: [],

    };
    this.fetchUsers = this.fetchUsers.bind(this);
    this.handleResultSelect = this.handleResultSelect.bind(this);
  }

  componentWillMount() {
    this.resetComponent();
    this.fetchUsers();
  }

  fetchUsers() {
    let component = this;
    axios
      .get('/search')
      .then(response => {
          console.log('response to fetch users', response)
          component.setState({
            users: response.data
          });
          console.log('state for search users', this.state);
      })
      .catch(err => {
        console.log('Error from login', err);
      });
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect(e, { result }) {
    console.log('select!', result);
    this.props.updateFriendsPage(result);
  }


  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(this.state.users, isMatch),
      })
    }, 300)
  }

  render() {
    return (
      <div>
          <Search
            loading={this.state.isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
            results={this.state.results}
            value={this.state.value}
            {...this.props}
          />
      </div>
    )
  }
}

export default SearchUsers;