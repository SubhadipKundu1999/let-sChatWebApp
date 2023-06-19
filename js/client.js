const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input')
const messageContainer = document.querySelector(".chat-body")
const userName= document.querySelector(".userName");
// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// Function which will append event info to the contaner
const append = (name, message, type)=>{
    const messageElement = document.createElement('div');
    if(type =="received-messages"){
        messageElement.innerHTML = 
         `<span class="avatar" >${name.charAt(0)}</span>${message}`
    }
        else{
    messageElement.innerHTML = message;
       }
        // messageElement.innerHTML=message;
    
    messageElement.classList.add('messages');
    messageElement.classList.add(type);
    messageContainer.append(messageElement);
    if(type =='received-messages'){ 
        audio.play();
    }
}


// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);
userName.innerHTML=name;

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    append(name ,`${name} joined the chat`, "sent-messages")
})

// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}`, `${data.message}`, "received-messages")
})

// If a user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name}`, `${name} left the chat`, "sent-messages")
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append("you" ,`You: ${message}`, "sent-messages");
    socket.emit('send', message);
    messageInput.value = ''
})
