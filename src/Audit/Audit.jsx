import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';

import { Navbar, Nav } from 'react-bootstrap';

import {AgGridReact} from 'ag-grid-react';

class Auditpage extends React.Component {
    componentDidMount() {
        this.props.getUsers(); 
    }

    handleDeleteUser(id) {
        return (e) => this.props.deleteUser(id);
    }


    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                {headerName: 'Make', field: 'make', sortable: true, filter: true},
                {headerName: 'Model', field: 'model', sortable: true, filter: true},
                {headerName: 'Price', field: 'price', sortable: true, filter: true}

            ],
            rowData: []
        }
    }

    componentDidMount() {
        fetch('https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/sample-data/rowData.json')
            .then(result => result.json())
            .then(rowData => this.setState({rowData}))
    }
    render() {
        const { user, users } = this.props;
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand ></Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link ><Link to="/">Home</Link></Nav.Link>
                        <Nav.Link href="#features">Auditor</Nav.Link>
                        <Nav.Link> <Link to="/login">Logout</Link></Nav.Link>
                    </Nav>
                </Navbar>
                <div className="col-md-12">
                <h3>Hi {user.firstName}!</h3>
                    <p>You're logged in with React!!</p>
                <p>DATA TABLE</p>
                    <div
                className="ag-theme-balham"
                style={{ height: '400px', width: '600px' }}
            >
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData} pagination = {true} paginationPageSize = {10}>
                </AgGridReact>
            </div>
                </div>
                <div className="col-md-12">
                    <h3>All login audit :</h3>
                    {users.loading && <em>Loading users...</em>}
                    {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                    {users.items &&
                        <ul className="user-screen">
                            {users.items.map((user, index) =>
                                <li key={user.id}>
                                    {user.id + ' ' + user.role + ' ' + user.createdDate + ' '}
                                    {user.firstName + ' ' + user.lastName}
                                    {
                                        user.deleting ? <em> - Deleting...</em>
                                            : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                                : <span> - <a onClick={this.handleDeleteUser(user.id)}>Delete</a></span>
                                    }
                                </li>
                            )}

                        </ul>
                    }
                    
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return { user, users };
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete
}

const connectedAuditPage = connect(mapState, actionCreators)(Auditpage);
export { connectedAuditPage as Auditpage };