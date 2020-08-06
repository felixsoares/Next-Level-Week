import React, { useState, useEffect } from 'react';
import './styles.css';
import { Link } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg';
import landingImg from '../../assets/images/landing.svg';
import studyIcon from '../../assets/images/icons/study.svg';
import giveClassesIcon from '../../assets/images/icons/give-classes.svg';
import purpleHeartIcon from '../../assets/images/icons/purple-heart.svg';
import api from '../../service/api';

function Landing() {

    const [totalConnections, setTotalConnections] = useState(0);

    useEffect(() => {
        api.get('connections').then(response => {
            const { count } = response.data;
            setTotalConnections(count)
        });
    }, []);

    return (
        <div id="page-landing">
            <div id="page-landing-content" className="container">
                <div className="logo-container">
                    <img src={logoImg} alt="Proffy" />
                    <h2>Sua plataforma de estudos online</h2>
                </div>

                <img src={landingImg} alt="" className="hero-image" />

                <div className="buttons-containers">
                    <Link to="/study" className="study">
                        <img src={studyIcon} alt="Estudar" />
                        Estudar
                    </Link>
                    <Link to="/give-classes" className="give-classes">
                        <img src={giveClassesIcon} alt="Estudar" />
                        Dar aulas
                    </Link>
                </div>

                <span className="total-connections">
                    Total de {totalConnections} conexões já realizadas <img src={purpleHeartIcon} alt="" />
                </span>
            </div>
        </div>
    );
}

export default Landing;