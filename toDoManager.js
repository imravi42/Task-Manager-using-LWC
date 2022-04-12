import { LightningElement, track } from 'lwc';
import getCurrentTodos from "@salesforce/apex/TodoController.getCurrentTodos";
import addTodo from "@salesforce/apex/TodoController.addTodo";

export default class ToDoManager extends LightningElement {
    time = "3:00 PM";
    greeting = "Good Afternoon";

    @track todos = [];

    connectedCallback() {
        this.getTime();
        this.fetchTodos();
        setInterval(() => {
            this.getTime();
        }, 1000);
    }

    getTime() {
        const date = new Date();

        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        //const milliSec = date.getMilliseconds();

        this.time = ` ${this.getHour(hour)}:${this.getDoubleDigit(min)}:${this.getDoubleDigit(sec)} ${this.getAmPm(hour)}`;

        this.setgreeting(hour);

    }

    //fn for getting 12 hr format.
    getHour(hour) {
        return hour === 0 ? 12 : hour > 12 ? (hour - 12) : hour;
    }

    //fn for getting AM/PM
    getAmPm(hour) {
        return hour >= 12 ? "PM" : "AM";
    }
    getDoubleDigit(digit) {
        return digit < 10 ? "0" + digit : digit;
    }
    setgreeting(hour) {
        if (hour < 12) {
            this.greeting = "Good Morning";
        } else if (hour >= 12 && hour < 17) {
            this.greeting = "Good Afternoon";
        } else {
            this.greeting = "Good Evening";
        }
    }

    /**ckeckKeyCode(component, event, helper) {
        if (component.which == 13) {
            this.addToDo();
        }
} */

    addToDoHandler() {
        //console.log("Enter key is pressed");
        const inputBox = this.template.querySelector("lightning-input");


        const todo = {
            todoName: inputBox.value,
            done: false
        }
        addTodo({ payload: JSON.stringify(todo) })
            .then(result => {
                if (result) {
                    //fetch fresh list of todos
                    this.fetchTodos();
                }
            })
            .catch(error => {
                console.error("Error in adding todo" + error);
            });
        inputBox.value = "";
    }

    fetchTodos() {
        getCurrentTodos()
            .then(result => {
                if (result) {
                    //update todos property with result
                    this.todos = result;
                }
            })
            .catch(error => {
                console.error("Error in fetching todo" + error);
            });
    }

    updateTodoHandler(event) {
        if (event) {
            this.fetchTodos();
        }
    }
    deleteTodoHandler(event) {
        if (event) {
            this.fetchTodos();
        }
    }


    get upcomingTasks() {
        return this.todos && this.todos.length ?
            this.todos.filter(todo => !todo.done) : [];
    }

    get completedTasks() {
        return this.todos && this.todos.length ?
            this.todos.filter(todo => todo.done) : [];
    }
}