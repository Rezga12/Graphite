import React from "react";
import styles from './QueryConsole.module.css'
import QueryField from "../queryField/QueryField";
import JsonDisplayer from "../jsonDisplayer/JsonDisplayer";
import LoadingIcon from "../loadingIcon/LoadingIcon";
import jsonTheme from "../../JsonColorScheme.module.css"

export default class QueryConsole extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            consoleWidth: 1200,
            prevX: undefined,
            drag: false,
            minIndex: 0,
        }

        this.lineHeight = 18;
        this.displayedDataSize = 70;
        this.tolerance = 10;

        this.addEventListeners();
        this.consoleRef = React.createRef();
        this.containerRef = React.createRef();
    }

    handleScroll = (scrollTop, dataLength) => {

        const scrollTopNumUp = this.state.minIndex;

        if(scrollTop > (this.tolerance + scrollTopNumUp) * this.lineHeight){
            const diff = Math.ceil((scrollTop - (this.tolerance * this.lineHeight + scrollTopNumUp * this.lineHeight)) / this.lineHeight);

            const newMinIndex = this.state.minIndex + diff;
            if(newMinIndex + this.displayedDataSize <= dataLength){
                this.setState({
                    minIndex: newMinIndex,
                });
            }else{
                this.setState({
                    minIndex: Math.max(0, dataLength - this.displayedDataSize),
                });
            }
        }else if(scrollTop < this.tolerance * this.lineHeight + scrollTopNumUp * this.lineHeight){
            const diff = Math.ceil((this.tolerance * this.lineHeight + scrollTopNumUp * this.lineHeight - scrollTop) / this.lineHeight);

            const newMinIndex = this.state.minIndex - diff;
            if(newMinIndex >= 0){
                this.setState({
                    minIndex: newMinIndex
                });
            }else{
                this.setState({
                    minIndex: 0
                });
            }
        }
    }

    getRenderModel(tabs, markup){
        return {
            tabs,
            markup,
        }
    }

    recursiveRenderJsonObject(model, tabs){
        let result = []

        if(Array.isArray(model)){
            result.push(this.getRenderModel(tabs, "["));
            model.forEach(entry => {
                result = result.concat(this.recursiveRenderJsonObject(entry, tabs + 1))
            })
            result.push(this.getRenderModel(tabs, "],"));
        }else if(typeof model === 'object'){
            result.push(this.getRenderModel(tabs, "{"));
            result = result.concat(this.recursiveRenderJsonObjectBody(model, tabs + 1))
            result.push(this.getRenderModel(tabs, "},"));
        }

        return result;
    }

    recursiveRenderJsonObjectBody(model, tabs){

        let result = []

        if(Array.isArray(model)){
            model.forEach(entry => {
                result = result.concat(this.recursiveRenderJsonObject(entry))
            })
        }else if(typeof model === 'object'){
            Object.keys(model).forEach(key => {
               if(Array.isArray(model[key])){
                   result.push(this.getRenderModel(tabs, <span><span className={jsonTheme.key}>{key}</span>: [</span>/*`${key}: [`*/))
                   model[key].forEach(entry => {
                       result = result.concat(this.recursiveRenderJsonObject(entry, tabs + 1))
                   })
                   result.push(this.getRenderModel(tabs, `],`))
               } else if(model[key] === null || model[key] === undefined){
                   result.push(this.getRenderModel(tabs, <span className={jsonTheme.key}>{key}: <span className={jsonTheme.nullColor}>null</span></span>/*`${key}: null,`*/))
               }else if(typeof model[key] === 'object'){
                   result.push(this.getRenderModel(tabs, <span><span className={jsonTheme.key}>{key}</span>: {'{'}</span>/*`${key}: {`*/))
                   result = result.concat(this.recursiveRenderJsonObjectBody(model[key], tabs + 1))
                   result.push(this.getRenderModel(tabs, `},`))
               }else if(typeof model[key] === 'number'){
                   result.push(this.getRenderModel(tabs, <span className={jsonTheme.key}>{key}: <span className={jsonTheme.numValue}>{model[key]}</span></span>/*`${key}: ${model[key]}`*/))
               }else{
                   result.push(this.getRenderModel(tabs, <span className={jsonTheme.key}>{key}: <span className={jsonTheme.numValue}>{'"'}{model[key]}{'"'}</span></span>/*`${key}: "${model[key]}"`*/))
               }
            });
        }

        return result;
    }

    recursiveRenderJson(model){

        return this.recursiveRenderJsonObject(model, 0).map((entry, i) => {
            return {
                key: i,
                markup: entry.markup,
                tabs: entry.tabs,
            }
        });
    }

    render() {
        return (<div className={styles.container} ref={this.containerRef}>
                    <div className={styles.queryContainer} style={{width: `${this.state.consoleWidth}px`}} ref={this.consoleRef}>
                        <QueryField queryHandler={this.props.queryHandler}
                                    schema={this.props.schema}
                                    typeDict={this.props.typeDict}
                                    connected={this.props.connected}
                        />
                    </div>

                    <div className={styles.handle} onMouseDown={this.handleMouseDown}>
                        <div className={styles.handleVision}>
                        </div>
                    </div>

                    <div className={styles.resultContainer} style={{width: `${window.innerWidth - this.state.consoleWidth}px`}}>
                        <JsonDisplayer data={this.recursiveRenderJson(this.props.result)}
                                       visible={!this.props.loading}
                                       lineHeight={18}
                                       tolerance={10}
                                       displayedDataSize={70}
                                       scrollHandler={this.handleScroll}
                                       minIndex={this.state.minIndex}
                        />
                        <LoadingIcon visible={this.props.loading}/>
                    </div>
                </div>);
    }

    handleMouseDown = e => {
        this.setState({drag: true, prevX: e.clientX});
    }


    handleMouseUp = e => {
        this.setState({drag: false, prevX: undefined});
    }

    moveHandler = e => {
        if(this.state.drag){
            const diff = e.clientX - this.state.prevX;
            const newConsoleWidth = this.state.consoleWidth + diff;
            this.setState({prevX: e.clientX, consoleWidth: newConsoleWidth})

        }
    }

    handleResize = e => {
        this.setState({consoleWidth: this.consoleRef.current.getBoundingClientRect().width})
    }

    addEventListeners(){
        document.addEventListener('mouseup', this.handleMouseUp);
        document.addEventListener("mousemove", this.moveHandler);
        window.addEventListener('resize',this.handleResize);
    }
}
