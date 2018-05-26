import React from 'react';
import Request from './request.jsx';

const RequestList = (props) => {
  return (
    <div>
      {props.requests.map((request, i) => <Request id={props.id} request={request} key={i} fetchRequests={props.fetchRequests} />)}
    </div>
  );
};
export default RequestList;