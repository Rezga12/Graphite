import React from "react";
import {fullTypeContainsPattern} from "../../../utils/UtilMethods";
import Marker from "../../marker/Marker";

export default class Scalar extends React.Component{

    render() {
        const colorTheme = this.props.theme;

        const render = fullTypeContainsPattern(this.props.model, this.props.pattern) || 'scalar'.includes(this.props.pattern);

        return (!render ? null : <div className={colorTheme.typeContainer}>
                    <label className={colorTheme.keyword}><Marker word={'scalar '}
                                                                  pattern={this.props.pattern}
                                                                  theme={this.props.theme}
                    /></label>
                    <label className={''}><Marker word={this.props.model.name}
                                                  pattern={this.props.pattern}
                                                  theme={this.props.theme}
                    /></label>
                </div>);
    }

}
