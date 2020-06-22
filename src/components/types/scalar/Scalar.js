import React from "react";
import styles from './Scalar.module.css'
import colorTheme from "../../../CodeColorScheme.module.css"
import {fullTypeContainsPattern} from "../../../utils/UtilMethods";
import publicStyles from "../../../Public.module.css";
import Marker from "../../marker/Marker";

export default class Scalar extends React.Component{

    render() {
        const render = fullTypeContainsPattern(this.props.model, this.props.pattern) || 'scalar'.includes(this.props.pattern);

        return (!render ? null : <div className={colorTheme.typeContainer}>
                    <label className={colorTheme.keyword}><Marker word={'scalar '} pattern={this.props.pattern}/></label>
                    <label className={''}><Marker word={this.props.model.name} pattern={this.props.pattern}/></label>
                </div>);
    }

}