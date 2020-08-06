import React from 'react';

import { Link } from 'react-router-dom';

import './styles.css';
import backIcon from '../../assets/images/icons/back.svg';
import logo from '../../assets/images/logo.svg';

interface PagerHeaderProps {
    title: string;
    description?: string;
}

const PagerHeader: React.FC<PagerHeaderProps> = (props) => {
    return (
        <header className="page-header" >
            <div className="top-bar-container">
                <Link to="/" className="">
                    <img src={backIcon} alt="Voltar" />
                </Link>
                <img src={logo} alt="Proffy" />
            </div>
            <div className="header-content">
                <strong>{props.title}</strong>
                {props.description && <p>{props.description}</p>}
                {props.children}
            </div>

        </header >
    );
}

export default PagerHeader;