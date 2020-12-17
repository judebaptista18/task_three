import React from "react";
import "./App.css";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
var fromDate = null;
var toDate = null;
var search = null;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fromDate: null,
      toDate: null,
      search: "",
      books: [],
      offset: 0,
      perPage: 5,
      currentPage: 0,
      favorite: [],
      pageCount: 0,
    };
    this.fetchData = this.fetchData.bind(this);
    this.filter = this.filter.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    var url =
      "http://newsapi.org/v2/top-headlines?" +
      "country=us&" +
      "apiKey=9385a722035f401ba28d4d8ec666410e";
    var req = new Request(url);
    fetch(req)
      .then((response) => response.json())
      .then((responseJsonFromServerData) => {
        console.log(responseJsonFromServerData["articles"]);

        const data = responseJsonFromServerData["articles"].slice(
          this.state.offset,
          this.state.offset + this.state.perPage
        );
        this.setState({
          data: data,
          books: responseJsonFromServerData["articles"],
          pageCount: Math.ceil(
            responseJsonFromServerData["articles"].length / this.state.perPage
          ),
        });
      });
  };

  filter = (input) => (event) => {
    let updatedData = [];
    let books = this.state.books;
    if (input === "search") {
      search = event.target.value;
      for (let i = 0; i < books.length; i++) {
        if (books[i].title.toLowerCase().includes(search.toLowerCase())) {
          console.log(books[i].title);
          updatedData.push(books[i]);
        }
      }
    }

    if (input === "from") {
      this.setState({ fromDate: event.target.value });
      fromDate = new Date(event.target.value);
    }

    if (input === "to") {
      this.setState({ toDate: event.target.value });
      toDate = new Date(event.target.value);
    }

    if (fromDate != null && toDate != null) {
      if (fromDate.getTime() >= toDate.getTime()) {
        alert("From Date should be greater than To Date");
      } else if (fromDate.getTime() < toDate.getTime()) {
        for (let i = 0; i < books.length; i++) {
          if (
            new Date(books[i].publishedAt) > fromDate &&
            new Date(books[i].publishedAt) < toDate
          ) {
            updatedData.push(books[i]);
          }
        }
      }
    }

    this.setState({
      data: updatedData,
    });

    if (event.target.value == "") {
      this.fetchData();
    }
  };

  addFavorite = (item) => {
    let fav = this.state.favorite;
    fav.push(item);
    this.setState({ favorite: fav });

    localStorage.setItem("fav", JSON.stringify(fav));
    alert("Added To Your Favorite");
    //  console.log(item);
  };

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.fetchData();
      }
    );
  };

  render() {
    return (
      <div className="App">
        <div style={{ padding: "10px" }}>
          <div className="container">
            <div className="text-left">
              <Link
                to="/favorite"
                className="btn btn-primary"
                style={{ margin: "20px" }}
              >
                {" "}
                show favorites
              </Link>
            </div>
            <div className="col-sm-6">
              <label>Name: </label>
              <input
                type="text"
                onChange={this.filter("search")}
                placeholder="Search by Title"
              ></input>
            </div>
            <div className="col-sm-6">
              <label>Date: </label>
              <input type="date" onChange={this.filter("from")}></input> -
              <input type="date" onChange={this.filter("to")}></input>
            </div>

            <div
              className="col-sm-offset-3 col-sm-6"
              style={{ marginTop: "20px" }}
            >
              {this.state.data.map((item, key) => {
                return (
                  <div
                    className="card text-center"
                    key={key}
                    style={{ padding: "10px" }}
                  >
                    <h3>{item.title}</h3>
                    <img src={item.urlToImage} style={{ width: "200px" }}></img>
                    <p>
                      <b>Author:</b>
                      {item.author}
                    </p>
                    <p>
                      <b>Published Date:</b>
                      {new Date(item.publishedAt).toLocaleString()}
                    </p>
                    <p>
                      <b>Description:</b>
                      {item.description}
                    </p>
                    <p>
                      <b>Content:</b>
                      {item.content}
                    </p>
                    <button
                      className="btn btn-success"
                      onClick={() => this.addFavorite(item)}
                    >
                      Add to favorite
                    </button>
                  </div>
                );
              })}
              <ReactPaginate
                previousLabel={"prev"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={this.state.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
