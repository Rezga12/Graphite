import React from "react";
import TypeLabel from "../typeLabel/TypeLabel";
import Marker from "../marker/Marker";

export default class Field extends React.Component{

    getArgs(args){

        const colorTheme = this.props.theme;

        const argObjectsOneLine = args.map((arg, i) => <label key={arg.name}>
            <label className={colorTheme.paramName}>{arg.name}</label>:
            <TypeLabel type={this.props.model.type} control={this.props.control} pattern={this.props.pattern} theme={this.props.theme}/>{i < (args.length-1) && ', '}
        </label>);

        const argObjectsMultipleLines = args.map((arg, i) => <label key={arg.name} className={colorTheme.tab}>
            <label className={colorTheme.paramName}>{arg.name}</label>:
            <TypeLabel type={this.props.model.type} control={this.props.control} pattern={this.props.pattern} theme={this.props.theme}/>{i < (args.length-1) && ', '} <br/>
        </label>);
        let result;

        switch (args.length) {
            case 0:
                result = <label />
                break;
            case 1:
            case 2:
                result = <label >
                    ({argObjectsOneLine})
                </label>
                break;
            default:
                result = <label>(
                    <br/>
                    {argObjectsMultipleLines})
                </label>
        }

        return result;
    }

    render(){

        const colorTheme = this.props.theme;

        return (<div className={colorTheme.typeField}>
                    <label className={colorTheme.classFieldColor}>
                        <Marker word={this.props.model.name}
                                pattern={this.props.pattern}
                                theme={this.props.theme}
                        />
                    </label>

                            {this.getArgs(this.props.model.args)}:
                    <TypeLabel type={this.props.model.type} control={this.props.control} pattern={this.props.pattern} theme={this.props.theme}/>
                </div>);
    }
}
