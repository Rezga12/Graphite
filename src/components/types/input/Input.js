import React from "react";
import TypeLabel from "../../typeLabel/TypeLabel";
import {fullTypeContainsPattern} from "../../../utils/UtilMethods";
import Marker from "../../marker/Marker";

export default class Input extends React.Component{
    render() {

        const colorTheme = this.props.theme;

        const render = fullTypeContainsPattern(this.props.model, this.props.pattern)  ||
            'input'.includes(this.props.pattern) ||
            this.props.model.name.includes(this.props.pattern);

        const fields = this.props.model.inputFields.map(field =>
            <div key={field.name} className={colorTheme.typeField}>
                <label><Marker word={field.name}
                               pattern={this.props.pattern}
                               theme={this.props.theme}
                /></label><span className={colorTheme}>{': '}</span>
                <TypeLabel type={field.type} control={this.props.control} pattern={this.props.pattern} theme={this.props.theme}/>
            </div>);

        return (!render ? null : <div className={colorTheme.typeContainer}>
                    <div>
                        <label className={colorTheme.keyword}>
                            <Marker word={'input'}
                                    pattern={this.props.pattern}
                                    theme={this.props.theme}
                            />
                        </label> <Marker word={this.props.model.name}
                                         pattern={this.props.pattern}
                                         theme={this.props.theme}
                    />{(<span className={this.props.theme.punctuationMarks}>{' {'}</span>)}
                    </div>
                    <div>{fields}</div>
                    <div>{(<span className={this.props.theme.punctuationMarks}>{'{'}</span>)}</div>
                </div>);
    }
}
