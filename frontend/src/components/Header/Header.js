import React from 'react';
import { Link, hashHistory } from 'react-router';

import './header.scss';
var owlBlack = require('../../public/imgs/owl-black.svg');

const Header = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    previousPageLink: React.PropTypes.string,
    previousPageText: React.PropTypes.string,
    initialSearchTerm: React.PropTypes.string,
    searchPlaceholder: React.PropTypes.string,
    onSearchSubmit: React.PropTypes.func,
    onSearchTermChange: React.PropTypes.func
  },

  search: function(e) {
    e.preventDefault();

    var searchTerm = document.getElementById("search").value;

    if (this.props.onSearchSubmit && searchTerm !== "") {
      this.props.onSearchSubmit(searchTerm);
    }
  },

  onSearchTermChange: function(e) {
    var searchTerm = document.getElementById("search").value;

    if (this.props.onSearchTermChange && searchTerm !== "") {
      this.props.onSearchTermChange(searchTerm);
    }
  },

  render: function() {
    var back;
    if (this.props.previousPageLink && this.props.previousPageText) {
      back = (
        <Link className="backLink" to={this.props.previousPageLink}>
          <div className="back" onClick={this.previousPage}>&#9664; {this.props.previousPageText}</div>
        </Link>
        );
    }

    // Search enabled if placeholder and submit or change given
    var search;
    if (this.props.searchPlaceholder && (this.props.onSearchSubmit || this.props.onSearchTermChange)) {
      search = (
        <form onSubmit={this.search} autoComplete="off">
          <input id="search" className="search" type="text" name="search-term" placeholder={this.props.searchPlaceholder} defaultValue={this.props.initialSearchTerm} onChange={this.onSearchTermChange} />
        </form>
      );
    }

    return (
      <div id="header">
        { back }
        <div className="main">
          <Link className="home-link" to="/">
            <img className="hero-owl" src={owlBlack}/>
            {this.props.title}
          </Link>
        </div>
        {search}
      </div>
    );
  }
});

export default Header;
