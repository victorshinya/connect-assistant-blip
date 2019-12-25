import React from "react";

// Style
import "./index.css";

// HTTP Request
import axios from "axios";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { iam_apikey: "", assistant_id: "", blip_identifier: "", blip_access_key: "", };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormInputChange = this.handleFormInputChange.bind(this);
  }

  handleSubmit = e => {
    e.preventDefault();
    axios.post("/api/setting", {
      iam_apikey: this.state.iam_apikey,
      assistant_id: this.state.assistant_id,
      blip_identifier: this.state.blip_identifier,
      blip_access_key: this.state.blip_access_key,
    })
      .then(res => {
        if (res.status === 200) {
          window.alert("Conected!");
        } else {
          window.alert("Something unexpected happened!");
        }
      })
      .catch(err => {
        window.alert("Fail to conect to the server");
      })
    this.setState({
      iam_apikey: "",
      assistant_id: "",
      blip_identifier: "",
      blip_access_key: "",
    })
  }

  handleFormInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <main>
        <div className="box box-center">
          <h1>Connect<br />Assistant</h1>
          <form type="POST" onSubmit={this.handleSubmit}>
            <input type="text" name="iam_apikey" value={this.state.iam_apikey} onChange={this.handleFormInputChange} placeholder="Watson Assistant API Key"></input>
            <input type="text" name="assistant_id" value={this.state.assistant_id} onChange={this.handleFormInputChange} placeholder="Watson Assistant ID"></input>
            <input type="text" name="blip_identifier" value={this.state.blip_identifier} onChange={this.handleFormInputChange} placeholder="BLIP Identifier"></input>
            <input type="text" name="blip_access_key" value={this.state.blip_access_key} onChange={this.handleFormInputChange} placeholder="BLIP Access Key"></input>
            <button type="submit">Salvar</button>
          </form>
        </div>
      </main>
    )
  }
}
