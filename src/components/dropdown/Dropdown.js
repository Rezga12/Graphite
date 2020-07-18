import React from "react";
import styles from './Dropdown.module.css'
import defaultIcon from '../../assets/icons/graphqlIcon.png'


function MenuItem(props){

    const logo = props.model.info?.logo

    return (<div className={styles.menuItemTitleContainer}
                 onClick={() => props.onCLick(props.model.url, props.model.info.title)}
            >
                <div className={styles.selectedIconContainer}>
                    <img className={styles.selectedIcon} src={defaultIcon} />
                </div>
                <div className={styles.selectedText} >
                    {props.model.info.title}
                </div>
            </div>);
}

export default class Dropdown extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            active: false,
            apiTitle: "Choose Api",
        }
    }

    clickHandler = e => {
        this.setState({
            active: !this.state.active
        })
    }

    hideBar = e => {
        this.setState({
            active: false,
        })
    }

    getCorrectSvgPath() {
        if(this.state.active){
            return <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" className={styles.iconColor}/>
        }

        return <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" className={styles.iconColor}/>
    }

    handleItemClick = (url, title) => {
        this.hideBar({});
        this.props.changeHandler(url);

        this.setState({
            apiTitle: title
        })
    }

    render(){

        const apis = this.props.apis.map(api => <MenuItem key={api.info.title}
                                                          model={api}
                                                          onCLick={this.handleItemClick}
        />);

        return (<div className={styles.container + ' ' + this.props.className} onMouseLeave={this.hideBar}>
                    <div className={styles.titleContainer} onClick={this.clickHandler} >
                        <div className={styles.selectedIconContainer}>
                            <img className={styles.selectedIcon} src={defaultIcon} alt={'default icon'}/>
                        </div>
                        <div className={styles.selectedText}>
                            {this.state.apiTitle}
                        </div>
                        <div className={styles.svgContainer}>
                            <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" height="35" viewBox="0 0 24 24" width="35" >
                                <path d="M0 0h24v24H0z" fill="none"/>
                                {this.getCorrectSvgPath()}
                            </svg>
                        </div>
                    </div>

                {this.state.active && <div className={styles.menuContainer}>
                        {apis}
                </div>}
                </div>);

    }
}
