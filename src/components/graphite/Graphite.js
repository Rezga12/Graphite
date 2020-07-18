import React from "react";
import styles from "./Graphite.module.css"
import  {introspectionQuery} from "../../utils/introspection/introspection";
import Schema from "../schema/Schema";
import QueryConsole from "../queryConsole/QueryConsole";
import apis from '../../utils/apis.json'
import Dropdown from "../dropdown/Dropdown";

export default class Graphite extends React.Component{
    
    constructor(props) {
        super(props);

        this.state = {
            schemaModel: {
                types: []
            },
            addressValue: 'http://localhost:5000/graphql',
            drag: false,
            queryWidth: 1200,
            queryResult: '',
            loading: false,
            typeDict: {},
            connectionEstablished: false,
            schemaVisibility: false,
            prevX: undefined,
            schemaWidth:300,
        };

        this.addEventListeners();
        this.queryWindowRef = React.createRef();

        console.log(apis);
    }

    componentDidMount() {
        this.fetchSchema(this.state.addressValue);
    }

    fetchSchema = (addressValue) => {
        fetch(addressValue, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: introspectionQuery
            }),
        }).then(res => {
            if(res.ok){
                return res.json();
            }
            throw res.statusText;
        }).then(obj => {
            const dict = {};
            obj.data.__schema.types.forEach(type => {
                dict[type.name] = type;
            })
            this.setState({
                schemaModel: obj.data.__schema,
                typeDict: dict,
                connectionEstablished: true,
            })
        }).catch(error => {
            console.log(error);
        });
    };

    sendQuery = query => {
        this.setState({loading: true})
        fetch(this.state.addressValue, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query.replace(/\s\s+/g, ' ')
            })
        }).then(res => {
            return res.json()
        }).then(obj => {
            if(obj.errors !== undefined){
                this.handleError(obj.errors);
            }else if(obj.data !== undefined){
                this.handleData(obj.data);
            }
        }).catch(error => {
            this.handleError({message: error.message});
        });
    }

    handleError(errors){
        this.setState({queryResult: errors, loading: false})
    }

    handleData(data){
        this.setState({queryResult: data, loading: false})
    }

    inputChanged = (event) => {
        this.setState({
            addressValue: event.target.value,
        });
    };

    handleChange = url => {
        this.fetchSchema(url);
    }

    render() {
        return (<div className={styles.container}>
                    <div className={styles.ideContainer} ref={this.queryWindowRef} >
                        <div className={styles.addressContainer}>
                            <div>
                                <input type={'text'} value={this.state.addressValue} onChange={this.inputChanged}/>
                                <button onClick={this.fetchSchema}>Fetch</button>
                            </div>

                            <Dropdown className={styles.dropDown} apis={apis} changeHandler={this.handleChange}/>
                        </div>

                        <div className={styles.queryContainer}>
                            <QueryConsole queryWidth={this.state.queryWidth}
                                          queryHandler={this.handleQuery}
                                          result={this.state.queryResult}
                                          loading={this.state.loading}
                                          schema={this.state.schemaModel}
                                          typeDict={this.state.typeDict}
                                          connected={this.state.connectionEstablished}
                            />
                        </div>
                    </div>

                    <div className={styles.schemaContainer}>
                        <div className={styles.buttonContainer}>
                            <div className={this.state.schemaVisibility ? styles.schemaButtonActive : styles.schemaButton} onClick={this.handleSchemaClick}>
                                <svg className={styles.schemaSvg} xmlns="http://www.w3.org/2000/svg" height="50" viewBox="0 0 24 24" width="50">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z" fill={'white'}/>
                                </svg>
                            </div>
                        </div>
                        <div className={styles.handler} style={{display: (this.state.schemaVisibility ? 'flex' : 'none')}}>
                            <div className={styles.hitArea} onMouseDown={this.downHandler}>

                            </div>
                        </div>
                        <div className={styles.contentContainer}
                             style={{
                                 display: (this.state.schemaVisibility ? 'flex' : 'none'),
                                 width: `${this.state.schemaWidth}px`
                             }}>
                            <Schema model={this.state.schemaModel}/>
                        </div>
                    </div>
                </div>);
    }

    handleSchemaClick = (e) => {
        this.setState({
            schemaVisibility: !this.state.schemaVisibility,
        })
    }

    handleQuery = query => {
        this.sendQuery(query)
    }

    downHandler = e => {
        this.setState({
            drag: true,
            prevX: e.clientX,
        });
    }

    upHandler = e => {
        this.setState({
            drag: false,
            prevX: undefined
        });
    }

    moveHandler = e => {
        if(this.state.drag){
            const diff = e.clientX - this.state.prevX;
            this.setState({
                schemaWidth: this.state.schemaWidth - diff,
                prevX: e.clientX
            })
        }
    }

    handleResize = e => {

    }

    addEventListeners(){
        document.addEventListener("mousemove", this.moveHandler);
        document.addEventListener("mouseup", this.upHandler);
    }
}
