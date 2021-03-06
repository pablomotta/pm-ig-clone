import React, { useContext } from 'react';
import AlertContext from '../../context/alert/alertContext';
import './style.scss';

const Alerts = () => {
	const alertContext = useContext(AlertContext);
	return (
		alertContext.alerts.length > 0 &&
		alertContext.alerts.map((alert) => (
			<div key={alert.id} className={`alert alert-${alert.type}`}>
				{alert.msg}
			</div>
		))
	);
};

export default Alerts;
