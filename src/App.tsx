import { useEffect, useState } from 'react';
import './App.css';
import io from "socket.io-client";
import { CONFIG } from './config';


function App() {

  const [message1, setMessage1] = useState('')
  const [message2, setMessage2] = useState('')
  const [messages, setMessages] = useState<any[]>([]);
  const [flagSend, setFlagSent] = useState(false)
  const socket = io(CONFIG.websocketUrl);

  useEffect(() => {
    socket.on('common_channel', ({ message, channel }) => {
      const obj = {
        message: message,
        channel: channel
      }
      setMessages(prevMessages => [...prevMessages, obj]);
      setMessage1('')
      setMessage2('')
      setFlagSent(false);
    });

    return () => {
      socket.off('common_channel');
    };
  }, [socket]);

  const handleMessage1 = () => {
    socket.emit('channel_1', message1);
    setFlagSent(true);
  }

  const handleMessage2 = () => {
    socket.emit('channel_2', message2);
    setFlagSent(true);
  }

  return (
    <div className="App">
      <div className="Header align-items-center justify-content-center d-flex">
        <h2>Simple Websocket Example</h2>
      </div>
      <div className="container mt-5 gx-5">
        <div className="col-12">
          <div className="row justify-content-center align-items-center">
            <div className="col-sm-6 input-area">
              {flagSend && (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only"></span>
                  </div>
                </div>
              )}
              <div className="row justify-content-center">
                <div className="col-sm-8 mt-5 mb-3">
                  <div className="row justify-content-center">
                    <input type="text" className='form-control' value={message1} onChange={(e) => setMessage1(e.target.value)} />
                    <input type="button" className='btn btn-outline-dark mt-2' value={'Send message 1'} onClick={handleMessage1} />
                  </div>
                </div>
                <div className="col-sm-8 mt-5 gx-5">
                  <div className="row justify-content-center">
                    <input type="text" className='form-control' value={message2} onChange={(e) => setMessage2(e.target.value)} />
                    <input type="button" className='btn btn-outline-dark mt-2' value={'Send message 2'} onClick={handleMessage2} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="row mt-5 justify-content-center">
                <div className="col-sm-8 mt-5">
                  <div className="row justify-content-center">
                    <div className="text-board-messages">
                      <h3>Messages Sent</h3>
                    </div>
                    <div className="cardChannel">
                      <ul className='mt-3'>
                        {messages.map((item, index) => {
                          return <div key={index} className={item.channel === 1 ? "message-channel-1" : "message-channel-2"}>
                            <h5>
                              {item.message}
                            </h5>
                          </div>;
                        })}
                      </ul>
                    </div>
                    <input type="button" className='mt-3 mb-5 btn btn-outline-dark' value={'Clear Messages'} onClick={() => setMessages([])} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
