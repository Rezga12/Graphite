import React from "react";
import styles from "./JsonDIsplayer.module.css"
import theme from "../../JsonColorScheme.module.css"

export default class JsonDisplayer extends React.Component{
    constructor(props) {
        super(props);

        this.viewportRef = React.createRef();
        this.dataSize = 100;

        this.state = {
            minIndex: 0,
            scrollTopNumUp: 0,
            scrollTopNumDown: this.dataSize - this.props.displayedDataSize,
            scrollTop: 0
        }

        console.log(this.recursiveRender(this.props.model, 0, false));

        this.refArr = []
    }

    componentDidMount() {
        this.viewportRef.current.scrollTop = this.state.scrollTop;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    handleScroll = e => {
        if(this.viewportRef.current.scrollTop > this.props.tolerance * this.props.lineHeight + this.state.scrollTopNumUp * this.props.lineHeight){
            const diff = Math.ceil((this.viewportRef.current.scrollTop - (this.props.tolerance * this.props.lineHeight + this.state.scrollTopNumUp * this.props.lineHeight)) / this.props.lineHeight);

            const newMinIndex = this.state.minIndex + diff;
            if(newMinIndex + this.props.displayedDataSize <= this.dataSize){
                this.setState({
                    minIndex: newMinIndex,
                    scrollTopNumUp: this.state.scrollTopNumUp + diff,
                    scrollTopNumDown: this.state.scrollTopNumDown - diff,
                });
            }else{
                this.setState({
                    minIndex: Math.max(0,this.dataSize - this.props.displayedDataSize),
                    scrollTopNumUp: Math.max(this.dataSize - this.props.displayedDataSize),
                    scrollTopNumDown: 0,
                });
            }
        }else if(this.viewportRef.current.scrollTop < this.props.tolerance * this.props.lineHeight + this.state.scrollTopNumUp * this.props.lineHeight){
            const diff = Math.ceil((this.props.tolerance * this.props.lineHeight + this.state.scrollTopNumUp * this.props.lineHeight - this.viewportRef.current.scrollTop) / this.props.lineHeight);

            const newMinIndex = this.state.minIndex - diff;
            if(newMinIndex >= 0){
                this.setState({
                    minIndex: newMinIndex,
                    scrollTopNumUp: this.state.scrollTopNumUp - diff,
                    scrollTopNumDown: this.state.scrollTopNumDown + diff,
                });
            }else{
                this.setState({
                    minIndex: 0,
                    scrollTopNumUp: 0,
                    scrollTopNumDown: Math.max(0,this.dataSize - this.props.displayedDataSize),
                });
            }
        }
    }

    getData(offset, length) {

        const data = []
        let j = 0;
        for(let i=offset;i<length+offset;i++){
            data.push({
                index: j,
                key: i,
                text: i + ") asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd"
            });
            j++;
        }

        return data;
    }


    recursiveRender(model, tabNum, first){
        // TODO recursive render into data from scratch.
    }

    render() {
        if(!this.props.visible){
            return null;
        }

        const data = this.getData(this.state.minIndex, Math.min(this.dataSize, this.props.displayedDataSize));

        const upVirtualHeight = this.state.scrollTopNumUp * this.props.lineHeight;
        const downVirtualHeight = this.state.scrollTopNumDown * this.props.lineHeight;

        return (<div className={styles.container}
                     ref={this.viewportRef}
                     style={{lineHeight: `${this.props.lineHeight}px`}}
                     onScroll={this.handleScroll}
        >
            <div className={styles.virtualPad} style={{height: `${upVirtualHeight}px`, minHeight: `${upVirtualHeight}px`}}/>

            {data.map(row => <div key={row.key} className={styles.row} ref={this.refArr[row.index]}>
                {row.text}
            </div>)}

            <div className={styles.virtualPad} style={{height: `${downVirtualHeight}px`, minHeight: `${downVirtualHeight}px`}}/>
        </div>)
    }
}
