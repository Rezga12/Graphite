import React from "react";
import styles from './QueryConsole.module.css'
import QueryField from "../queryField/QueryField";
import JsonDisplayer from "../jsonDisplayer/JsonDisplayer";
import LoadingIcon from "../loadingIcon/LoadingIcon";

export default class QueryConsole extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            consoleWidth: 1200,
            prevX: undefined,
            drag: false,
        }

        this.addEventListeners();
        this.consoleRef = React.createRef();
        this.containerRef = React.createRef();
    }

    render() {

        return (<div className={styles.container} ref={this.containerRef}>
                    <div className={styles.queryContainer} style={{width: `${this.state.consoleWidth}px`}} ref={this.consoleRef}>
                        <QueryField queryHandler={this.props.queryHandler}/>
                    </div>

                    <div className={styles.handle} onMouseDown={this.handleMouseDown}>
                        <div className={styles.handleVision}>
                        </div>
                    </div>

                    <div className={styles.resultContainer} style={{width: `${window.innerWidth - this.state.consoleWidth}px`}}>
                        <JsonDisplayer model={this.props.result}
                                       visible={!this.props.loading}
                                       lineHeight={18}
                                       tolerance={10}
                                       displayedDataSize={70}
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
        //console.log(this.state.schemaWidth, , this.schemaWindowRef.current.innerWidth);
        this.setState({consoleWidth: this.consoleRef.current.getBoundingClientRect().width})
    }

    addEventListeners(){
        document.addEventListener('mouseup', this.handleMouseUp);
        document.addEventListener("mousemove", this.moveHandler);
        window.addEventListener('resize',this.handleResize);
    }
}
