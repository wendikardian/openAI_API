import logo from "./logo.svg";
import "./App.css";
import "./normal.css";
import { useState, useEffect } from "react";

function App() {



  const [input, setInput] = useState("");
  const [models, setModels] = useState([])
  const [currentModel, setCurrentModel] = useState("text-davinci-003")
  const [chatLog, setChatLog] = useState([

]);

useEffect(() => {
  getEngines()
  console.log(models)
}, [])

async function getEngines(){
  fetch("http://localhost:3080/models")
  .then(res => res.json())
  .then( data => {
    console.log(data.models)
    setModels(data.models)
  })
}



function clearChat(){
  setChatLog([]);
}

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, {user : "me", message : `${input}`}]
     setInput("");
     setChatLog(chatLogNew);
    // console.log('submit')
    const messages =chatLogNew.map((message) => message.message).join("\n")
    // Fetch response to the api combining the chatlog array of messages and sending it as a message to localhost:3000 as post
    const response = await fetch("http://localhost:3080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
        currentModel
      }),
    });
    const data = await response.json();
    setChatLog([...chatLogNew, {user : "gpt", message : data.message}])
    console.log(data.message)


  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className="models">
          <select onChange={(e) => {
            setCurrentModel(e.target.value)
          }}>
            {
              models.map((model, index) => (
                <option key={model.id} value={model.id}>{model.id}</option>
              ))
            }
          </select>
        </div>

      </aside>
      <section className="chatbox">
        <div className="toScroll">

        
        {
          chatLog.map((message, index) => {
            return(
              <ChatMessage message={message} key={index} />
            )
          })
        }
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              row="1"
              className="chat-input-textarea"
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = (message) => {
  return (
    <div className={`chat-log ${message.message.user === 'gpt' ? 'chatgpt' : ''}`}>
      <div className={`avatar ${message.message.user === 'gpt' ? 'green' : ''}`}></div>
      <div className="user">{message.message.message}</div>
    </div>
  );
};

export default App;
