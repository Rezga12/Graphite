import React from "react";
import styles from './InputParameter.module.css'
import {TypeKind} from "graphql";

export default class InputParameter extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            active: false,
        }
    }

    handleClick = e => {
        this.setState({
            active: !this.state.active,
        })
    }

    getTypeNameRecursively(type){
        if(type.kind === TypeKind.NON_NULL || type.kind === TypeKind.LIST){
            return this.getTypeNameRecursively(type.ofType)
        }

        return type.name;
    }

    getTypeKindRecursively(type){
        if(type.kind === TypeKind.NON_NULL || type.kind === TypeKind.LIST){
            return this.getTypeKindRecursively(type.ofType)
        }

        return type.kind;
    }

    receiveFromChild = (model) =>{

    }

    renderInputObjects(){
        if(this.getTypeKindRecursively(this.props.model.type) === TypeKind.INPUT_OBJECT){
            return this.props.typeDict[this.getTypeNameRecursively(this.props.model.type)].inputFields.map(field =>
                        <InputParameter key={field.name}
                                        model={field}
                                        typeDict={this.props.typeDict}
                                        receiver={this.receiveFromChild}
                        />
                    )

        }else{
            return <div style={{marginLeft: '2em'}}>
                        <input />
                    </div>
        }
    }

    render() {
        return (
            <div className={styles.container} style={{marginLeft: '2em'}}>
                <button onClick={this.handleClick} className={styles.button}>{this.state.active ? "-" : "+"}</button>
                <span className={this.state.active ? styles.active : ''}>
                    {this.props.model.name}: {' '}
                </span>
                <span className={styles.type}>
                    {this.getTypeNameRecursively(this.props.model.type)}
                </span>
                {this.state.active && this.renderInputObjects()}
            </div>
        );
    }
}
