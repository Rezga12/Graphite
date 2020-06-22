import React from "react";
import "./Generated.css"
import styles from "./LoadingIcon.module.css"

export default class LoadingIcon extends React.Component{

    render(){
        if(!this.props.visible){
            return null;
        }

        return (<div className={styles.container}>
                    <div className="loadingio-spinner-rolling-b59357emld">
                        <div className="ldio-4m4wdo0nu9b">
                            <div/>
                        </div>
                    </div>
                </div>);
    }
}
