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

        this.args = []
    }

    handleClick = (id, i, active) => {
        if(active){
            this.setState({
                elems: this.state.elems.slice(0, i).concat(this.state.elems.slice(i+1))
            })

            this.args = this.args.slice(0, i).concat(this.args.slice(i+1))
        }else{
            const arr = this.state.elems.slice()
            arr.push({
                key: ++this.counter,
                model: this.props.model
            })

            this.args.push({})

            this.setState({
                elems: arr,
            })
        }
    }

    receiveFromChild = (args, i) => {
        if(args[Object.keys(args)[0]] === null) {
            this.args = this.args.slice(0, i).concat(this.args.slice(i))
        }else{
            if(Object.keys(args).length !== 0){
                this.args[i] = {...this.args[i], ...args}
            }
        }

        this.props.receiver(this.args)
    }

    render(){
        const inputs = this.state.elems.map((elem,i) => <InputParameter model={{type:elem.model, name: i}}
                                                                          typeDict={this.props.typeDict}
                                                                          receiver={this.receiveFromChild}
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
