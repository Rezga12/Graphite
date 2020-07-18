import React, {createElement} from 'react'
import styles from './Schema.module.css'
import {TypeKind} from "graphql";
import ObjectType from "../types/object/Object";
import Scalar from "../types/scalar/Scalar";
import Union from "../types/union/Union";
import Enum from "../types/enum/Enum";
import Input from "../types/input/Input";


// You can import themes here:

import classic from './schemaThemes/Classic.module.css'
import dark from './schemaThemes/Dark.module.css'
import sublime from './schemaThemes/Sublime.module.css'

export default class Schema extends React.Component{

    constructor(props) {
        super(props);

        const theme = localStorage.getItem('theme');
        console.log(theme);

        this.state = {
            control: false,
            pattern: '',
            schemaTheme:  theme ? theme : 'Classic',
        };

        this.state[TypeKind.OBJECT] = true;
        this.state[TypeKind.SCALAR] = true;
        this.state[TypeKind.INTERFACE] = true;
        this.state[TypeKind.UNION] = true;
        this.state[TypeKind.ENUM] = true;
        this.state[TypeKind.INPUT_OBJECT] = true;

        this.state['introspection'] = false;

        this.addEventListeners();

        this.types = {}
        this.types[TypeKind.OBJECT] = ObjectType;
        this.types[TypeKind.SCALAR] = Scalar;
        this.types[TypeKind.INTERFACE] = ObjectType;
        this.types[TypeKind.UNION] = Union;
        this.types[TypeKind.ENUM] = Enum;
        this.types[TypeKind.INPUT_OBJECT] = Input;


        // You can Add Themes Here
        this.themes = {
            "Classic": classic,
            "Dark": dark,
            "Sublime": sublime
        }
    }

    addEventListeners(){
        document.addEventListener('keydown', event => {
            if(event.key === "Control"){
                if(this.state.control === false){
                    this.setState({control: true});
                }
            }
        });

        document.addEventListener('keyup', event => {
            if(event.key === 'Control'){
                this.setState({control: false});
            }
        });
    }

    onThemeChange = e => {
        this.setState({
            schemaTheme: e.target.value
        }, () => {
            localStorage.setItem('theme', this.state.schemaTheme);
        });
    };

    render(){
        const types = this.props.model.types
            .filter(this.filter)
            .sort((type1, type2) => -type1.kind.localeCompare(type2.kind))
            .map(type => createElement(this.types[type.kind],{
                model: type,
                key: type.name,
                control: this.state.control,
                pattern: this.state.pattern,
                theme: this.themes[this.state.schemaTheme]
        }, null));

        const themeOptions = Object.keys(this.themes).map(name => <option key={name}>{name}</option>);

        return (<div className={this.themes[this.state.schemaTheme].plainTextColor + " " + styles.container + " " + this.themes[this.state.schemaTheme].mainContainer}>
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <input type={'text'} onChange={this.searchInputChangeHandler} value={this.state.pattern} placeholder={'Search'}/>
                            <select onChange={this.onThemeChange} value={this.state.schemaTheme}>
                                {themeOptions}
                            </select>
                        </div>

                        <div>
                            <div>
                                <input type={'checkbox'}
                                       onChange={e => this.handleCheck(e, "introspection")}/> introspection types
                            </div>
                            <div>
                                <input type={'checkbox'}
                                       onChange={e => this.handleCheck(e, TypeKind.SCALAR)}
                                       checked={this.state[TypeKind.SCALAR]}/> scalars
                            </div>
                            <div>
                                <input type={'checkbox'}
                                       onChange={e => this.handleCheck(e, TypeKind.ENUM)}
                                       checked={this.state[TypeKind.ENUM]}/> enums
                            </div>
                            <div>
                                <input type={'checkbox'}
                                       onChange={e => this.handleCheck(e, TypeKind.OBJECT)}
                                       checked={this.state[TypeKind.OBJECT]}/> objects
                            </div>
                            <div>
                                <input type={'checkbox'}
                                       onChange={e => this.handleCheck(e, TypeKind.UNION)}
                                       checked={this.state[TypeKind.UNION]}/> unions
                            </div>
                            <div>
                                <input type={'checkbox'}
                                       onChange={e => this.handleCheck(e, TypeKind.INTERFACE)}
                                       checked={this.state[TypeKind.INTERFACE]}/> interfaces
                            </div>
                            <div>
                                <input type={'checkbox'}
                                       onChange={e => this.handleCheck(e, TypeKind.INPUT_OBJECT)}
                                       checked={this.state[TypeKind.INPUT_OBJECT]}/> inputs
                            </div>
                        </div>
                    </div>
                    {types}
                </div>);
    }

    searchInputChangeHandler = e => {
        if(/^[a-z_]+$/i.test(e.target.value) || e.target.value === ''){
            this.setState({pattern: e.target.value});
        }

    }

    handleCheck(e, typeKind){
        this.setState({[typeKind] : e.target.checked});
    }

    filter = type => {
        let ans = true;
        if(!this.state['introspection']){
           ans = type.name.substr(0,2) !== '__';
        }

        ans = ans && this.filterCheck(type, TypeKind.ENUM);
        ans = ans && this.filterCheck(type, TypeKind.SCALAR);
        ans = ans && this.filterCheck(type, TypeKind.UNION);
        ans = ans && this.filterCheck(type, TypeKind.INTERFACE);
        ans = ans && this.filterCheck(type, TypeKind.INPUT_OBJECT);
        ans = ans && this.filterCheck(type, TypeKind.OBJECT);

        return ans;
    }

    filterCheck(type, kind){
        if(!this.state[kind]){
            return type.kind !== kind;
        }

        return true;
    }

}
