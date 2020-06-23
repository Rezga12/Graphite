import React from "react";
import styles from "./JsonDIsplayer.module.css"
import theme from "../../JsonColorScheme.module.css"

export default class JsonDisplayer extends React.Component{
    constructor(props) {
        super(props);

        this.viewportRef = React.createRef();
        this.data = [];

        this.refArr = []
    }

    /*handleScroll = (scrolltop) => {
        if(this.viewportRef.current.scrollTop > this.props.tolerance * this.props.lineHeight + this.state.scrollTopNumUp * this.props.lineHeight){
            const diff = Math.ceil((this.viewportRef.current.scrollTop - (this.props.tolerance * this.props.lineHeight + this.state.scrollTopNumUp * this.props.lineHeight)) / this.props.lineHeight);

            const newMinIndex = this.state.minIndex + diff;
            if(newMinIndex + this.props.displayedDataSize <= this.data.length){
                this.setState({
                    minIndex: newMinIndex,
                    scrollTopNumUp: this.state.scrollTopNumUp + diff,
                    scrollTopNumDown: this.state.scrollTopNumDown - diff,
                });
            }else{
                this.setState({
                    minIndex: Math.max(0,this.data.length - this.props.displayedDataSize),
                    scrollTopNumUp: Math.max(this.data.length - this.props.displayedDataSize),
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
                    scrollTopNumDown: Math.max(0,this.data.length - this.props.displayedDataSize),
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
    }*/

    handleScroll = e => {
        this.props.scrollHandler(this.viewportRef.current.scrollTop, this.props.data.length);
    }

    getData(offset, length) {

        return this.props.data.slice(offset,length + offset);
    }

    render() {
        if(!this.props.visible){
            return null;
        }

        const data = this.getData(this.props.minIndex, Math.min(this.props.data.length, this.props.displayedDataSize));

        console.log(data);

        const upVirtualHeight = this.props.minIndex * this.props.lineHeight;
        const downVirtualHeight = (this.props.data.length - this.props.displayedDataSize - this.props.minIndex) * this.props.lineHeight;

        return (<div className={styles.container}
                     ref={this.viewportRef}
                     style={{lineHeight: `${this.props.lineHeight}px`}}
                     onScroll={this.handleScroll}
        >
            <div className={styles.virtualPad} style={{height: `${upVirtualHeight}px`, minHeight: `${upVirtualHeight}px`}}/>

            {data.map(row => <div key={row.key} className={styles.row}>
                <span style={{paddingLeft: `${row.tabs}em`}} />{row.markup}
            </div>)}

            <div className={styles.virtualPad} style={{height: `${downVirtualHeight}px`, minHeight: `${downVirtualHeight}px`}}/>
        </div>)
    }
}
