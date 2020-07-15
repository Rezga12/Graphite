import React from "react";
import colorTheme from "../../../CodeColorScheme.module.css"
import Field from "../../field/Field";
import {TypeKind} from "graphql";
import TypeLabel from "../../typeLabel/TypeLabel";
import {fullTypeContainsPattern} from "../../../utils/UtilMethods";
import Marker from "../../marker/Marker";

export default class ObjectType extends React.Component{
    render(){
        const fields = this.props.model.fields.map(field =>
            <Field model={field} key={field.name} control = {this.props.control} pattern={this.props.pattern}/>
        );

        let interfaces = []
        if(this.props.model.interfaces !== null){
            interfaces = this.props.model.interfaces.map((_interface,i) =>
                <label key={_interface.name}>
                    <TypeLabel type={_interface} control={this.props.control} pattern={this.props.pattern}/>
                    {i === this.props.model.interfaces.length - 1 ? '' : ', '}
                </label>)
        }

        let type = this.props.model.kind === TypeKind.INTERFACE ? 'interface' : 'type';
        const render = fullTypeContainsPattern(this.props.model, this.props.pattern) || type.includes(this.props.pattern);

        return (!render ? null : <div className={colorTheme.typeContainer}>
                    <div>
                        <label className={colorTheme.keyword}><Marker word={type} pattern={this.props.pattern}/> </label>
                        <Marker word={this.props.model.name} pattern={this.props.pattern}/>
                        {interfaces.length > 0 && <label className={colorTheme.keyword}><Marker word={' implements '} pattern={this.props.pattern}/></label>}
                        {interfaces}
                        {' {'}
                    </div>
                    {fields}
                    <div>{'}'}</div>
                </div>);
    }
}
