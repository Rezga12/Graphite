import React from "react";
import colorTheme from "../../../CodeColorScheme.module.css"
import {fullTypeContainsPattern} from "../../../utils/UtilMethods";
import Marker from "../../marker/Marker";

export default class Enum extends React.Component{
    render() {
        const enumValues = this.props.model.enumValues.map(value => <div key={value.name} className={`${colorTheme.enumField} ${colorTheme.typeField}`}>
            <Marker word={value.name} pattern={this.props.pattern}/>
        </div>);
        const render = fullTypeContainsPattern(this.props.model, this.props.pattern) || 'enum'.includes(this.props.pattern);

        return (!render ? null : <div className={colorTheme.typeContainer}>
                    <label className={colorTheme.keyword}><Marker word={'enum '} pattern={this.props.pattern}/></label>
                        <Marker word={this.props.model.name} pattern={this.props.pattern}/> {'{'}
                        {enumValues}
                    {'}'}
                </div>);
    }
}
