import InputParameter from "../InputParameter/InputParameter";
import React from "react";

export default class InputParameterWrapper extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            active: this.props.active
        }
    }

    handleClick = e => {
        this.props.clickHandler(this.props.key, this.props.index, this.state.active);
    };

    render(){
        return <InputParameter model={this.props.model}
                               typeDict={this.props.typeDict}
                               receiver={this.props.receiver}
        />
    }

}
