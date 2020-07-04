import React from "react";
import InputParameter from "../InputParameter/InputParameter";

export default class InputParameterList extends React.Component{
    constructor(props) {
        super(props);

        this.counter = 0;

        this.state = {
            elems: [{
                key: ++this.counter,
                model: this.props.model
            }]
        }
    }

    handleClick = (id, i, active) => {
        if(active){
            this.setState({
                elems: this.state.elems.slice(0, i).concat(this.state.elems.slice(i+1))
            })
        }else{
            const arr = this.state.elems.slice()
            arr.push({
                key: ++this.counter,
                model: this.props.model
            })

            this.setState({
                elems: arr,
            })
        }
    }

    render(){
        const inputs = this.state.elems.map((elem,i) => <InputParameter model={{type:elem.model, name: i}}
                                                                          typeDict={this.props.typeDict}
                                                                          receiver={this.props.receiver}
                                                                          clickHandler={this.handleClick}
                                                                          key={elem.key}
                                                                          index={i}
                                                                          _key={elem.key}
        />);

        return (<div>
            {inputs}
        </div>);
    }
}
