import React from "react";
import styles from "./Graphite.module.css"
import  {introspectionQuery} from "../../utils/introspection/introspection";
import Schema from "../schema/Schema";
import QueryConsole from "../queryConsole/QueryConsole";

export default class Graphite extends React.Component{
    
    constructor(props) {
        super(props);

        this.state = {
            schemaModel: {
                types: []
            },
            addressValue: 'http://localhost:4466',
            drag: false,
            queryWidth: 1200,
            queryResult: '',
            loading: false,
            typeDict: {},
            connectionEstablished: false
        };

        this.addEventListeners();
        this.queryWindowRef = React.createRef();
    }

    componentDidMount() {
        this.fetchSchema({});
    }

    fetchSchema = (event) => {
        fetch(this.state.addressValue, {
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

    render() {
        return (<div className={styles.container}>
                    <div className={styles.ideContainer} ref={this.queryWindowRef} >
                        <div className={styles.addressContainer}>
                            <input type={'text'} value={this.state.addressValue} onChange={this.inputChanged}/>
                            <button onClick={this.fetchSchema}>Fetch</button>
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
                </div>);
    }

    handleQuery = query => {
        this.sendQuery(query)
    }

    downHandler = e => {
        this.setState({drag: true, prevX: e.clientX});
    }

    upHandler = e => {
        this.setState({drag: false, prevX: undefined});
    }

    moveHandler = e => {
        if(this.state.drag){
            const diff = e.clientX - this.state.prevX;
            const newQueryWidth = this.state.queryWidth + diff;
            if(newQueryWidth >= 400 && window.innerWidth - newQueryWidth >= 300){
                this.setState({prevX: e.clientX, queryWidth: newQueryWidth});
            }
        }
    }

    handleResize = e => {
        this.setState({queryWidth: this.queryWindowRef.current.getBoundingClientRect().width})
    }

    addEventListeners(){
        document.addEventListener("mousemove", this.moveHandler);
        document.addEventListener("mouseup", this.upHandler);
        window.addEventListener('resize',this.handleResize );
    }
}
