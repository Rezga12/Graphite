import React from "react";
import styles from "./DynamicParameter.module.css"

export default class DynamicParameter extends React.Component{
    constructor(props) {
        super(props);

        this.state={
            active: false
        }
    }

    handleClick = e => {
        this.setState({
            active: !this.state.active
        })
    }

    render(){
        return <div>
            <button onClick={this.handleClick}>{this.state.active ? "-" : "+"}</button>
            <span>{this.props.model.name}</span>
        </div>
    }
}
