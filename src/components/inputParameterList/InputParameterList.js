import InputParameter from "../InputParameter/InputParameter";
import styles from './InputParameterList.module.css'
import React from "react";

export default class InputParameterList extends React.Component{
    constructor(props) {
        super(props);
    }

    handleClick = () => {
        console.log("overloaded");
    }

    render(){

        return (<div>
            hmm
            <InputParameter model={{type:this.props.model, name:'0'}}
                            typeDict={this.props.typeDict}
                            receiver={this.props.receiver}
            />
        </div>);
    }
}
