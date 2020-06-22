import React from "react";
import styles from "./QueryField.module.css"

export default class QueryField extends React.Component{

    constructor(props) {
        super(props);

        this.textareaRef = React.createRef()
    }

    render() {
        return (
            <div className={styles.container} >
                <div className={styles.textarea} contentEditable={true} ref={this.textareaRef}>

                </div>
                <button className={styles.button} onClick={this.handleClick}>
                    Send Query
                </button>
            </div>
        );
    }

    handleClick = e => {
        this.props.queryHandler(this.textareaRef.current.textContent);
    }
}
