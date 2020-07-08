import React from "react";
import TypeLabel from "../../typeLabel/TypeLabel";
import colorTheme from "../../../CodeColorScheme.module.css";
import {fullTypeContainsPattern} from "../../../utils/UtilMethods";
import Marker from "../../marker/Marker";

export default class Union extends React.Component{
    render() {
        const render = fullTypeContainsPattern(this.props.model, this.props.pattern) || 'union'.includes(this.props.pattern);

        const possibleTypes = this.props.model.possibleTypes.map((type, i) =>
            <label key={type.name}>
                <TypeLabel type={type} control={this.props.control} pattern={this.props.pattern}/>
                {i === this.props.model.possibleTypes.length - 1 ? '' : ' | '}
            </label>
        );

        return (!render ? null : <div>
                    <label className={colorTheme.keyword}><Marker word={'union '} pattern={this.props.pattern}/></label>
                    <label className={''}><Marker word={this.props.model.name} pattern={this.props.pattern}/></label>
                    {' = '}
                    {possibleTypes}
                </div>);
    }
}