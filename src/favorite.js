import React from "react";
import "./App.css";

class Favorite extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <div style={{ padding: "10px" }}>
          <div className="container">
            <div className="text-center">
              <h3>Favorites</h3>
            </div>

            <div
              className="col-sm-offset-3 col-sm-6"
              style={{ marginTop: "20px" }}
            >
              {JSON.parse(localStorage.getItem("fav")).map((item, key) => {
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Favorite;
