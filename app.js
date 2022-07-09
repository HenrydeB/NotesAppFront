const app = new Vue({
    el: "#app",
    data: {
        loggedin: false,
        JWT: "",
        createUserName: '',
        createPW: '',
        loginUserName: '',
        loginPW: '',
        devURL: "http://localhost:3000",
        prodURL: null,
        user: null,
        token: null,
        notes: [],
        newNote: '',
        updateNote: '',
        editID: 0
    },
    methods: {
        handleLogin: function(event){
            event.preventDefault
            const URL = this.prodURL ? this.prodURL : this.devURL;
            const user = { username: this.loginUserName, password: this.loginPW };
            fetch(`${URL}/login`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            .then( (response) => response.json())
            .then((data) => {
                if(data.error){
                    alert('error logging in')
                } else {
                    this.user = data.user;
                    this.token = data.token;
                    this.loggedin = true;
                    this.getNotes();
                    this.loginPW = "";
                    this.loginUserName= "";
                    window.sessionStorage.setItem('login', JSON.stringify(data));
                }
                
            })
        },
        handleLogout: function(){
            this.loggedin= false
            this.user = null
            this.token = null
            window.sessionStorage.removeItem('login')
        },
        handleSignup: function(){
            const URL = this.prodURL ? this.prodURL : this.devURL;
            const user = {username: this.createUserName, password: this.createPW};

            fetch(`${URL}/users`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    alert("invalid input")
                } else {
                    alert('signup successful')
                    this.user = data.user
                    this.token = data.token
                    this.loggedin = true,
                    this.createPW = "",
                    this.createUserName = ""
                }
            })
        },
        getNotes: function() {
            const URL = this.prodURL ? this.prodURL : this.devURL;
            fetch(`${URL}/notes`, {
                method: "get",
                headers:{
                    Authorization: `bearer ${this.token}`
                }
            })
            .then(response =>response.json())
            .then(data => {
                this.notes = data
            })
        },
        createNote: function(){
            const URL = this.prodURL ? this.prodURL : this.devURL;
            const note = { message: this.newNote }

            fetch(`${URL}/notes`, {
                method: "post",
                headers:{
                    "content-Type": "application/json",
                    "Authorization": `bearer ${this.token}`
                },
                body: JSON.stringify(note)
            })
            .then(response => {
                this.newNote = ""
                this.getNotes()
            })
            
        },
        deleteNote: function(event){
            const ID = event.target.id;
            const URL = this.prodURL ? this.prodURL : this.devURL;

            fetch(`${URL}/notes/${ID}`, {
                method: "delete",
                headers: {
                    Authorization: `bearer ${this.token}`
                }
            })
            .then(response => {
                this.getNotes();
            });
        },
        editNote: function(event){
            
            const URL = this.prodURL ? this.prodURL : this.devURL;
            const ID = event.target.id;
            const updated = {message: this.updateNote}

            fetch(`${URL}/notes/${ID}`, {
                method: "put",
                headers: {
                    Authorization: `bearer ${this.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updated)
            }).then((response) => {
                this.getNotes();
            });
        },
        editSelect: function(event){
            this.editID = event.target.id
            console.log(this.editID, event.target.id)
            const theNote = this.notes.find((note) => {
                return note.id == this.editID
            })
            console.log(theNote)
            this.updateNote = theNote.message
        },
    },
    created: function(){
        const getLogin = JSON.parse(window.sessionStorage.getItem('login'))
        console.log(getLogin)

        if(getLogin){
            this.user = getLogin.user
            this.token = getLogin.token
            this.loggedin = true,
            this.getNotes();
        }
        
    }
});