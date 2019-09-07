import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchUsers, createUser, deleteUser, updateUser, cancel, fetchOneUser, changeEvent } from '../actions/user-action';
import { getNationality } from '../actions/info-action';
import { selectPage } from '../actions/pagination-action';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CrudForm from './CrudForm';
import CrudPagination from './CrudPagination';
import CrudTable from './CrudTable';

class Crud extends Component{
    onSubmitHandler = (e) => {
        e.preventDefault();
        // Validate
        if (!this.validateForm()) {
            return false;
        }
        this.props.createUser().then(() => localStorage.setItem("users", JSON.stringify(this.props.users)));
        this.successMsg('Success');
    }
    updateHandler = () => {
        this.props.updateUser().then(() => localStorage.setItem("users", JSON.stringify(this.props.users)));
    }
    deleteHandler = (id) => {
        this.props.deleteUser(id).then(() => localStorage.setItem("users", JSON.stringify(this.props.users)));
    }
    componentDidMount() {
        this.props.getNationality();
        if (this.props.users.length === 0) { 
            this.props.fetchUsers();
        }
    }
    validateForm = () => {
        if (this.props.firstName === "" || this.props.lastName === "" || this.props.birthday === "" || this.props.phone === "" || this.props.salary === null) {
            this.errorMsg("กรุณากรอกข้อมูลให้ครบ");
            return false;
        }
        if (!(/^[0-9]+$/.test(this.props.citizenId))) {
            this.errorMsg("citizen id ต้องเป็นตัวเลข")
            return false;
        }
        return true;
    }
    errorMsg = (msg) => {
        toast.error(msg, {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    }
    successMsg = (msg) => {
        toast.success(msg, {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    }
    render() {
        return (
            <div>
                <CrudForm 
                    title={this.props.title}
                    firstName={this.props.firstName}
                    lastName={this.props.lastName}
                    birthday={this.props.birthday}
                    nationality={this.props.nationality}
                    citizenId={this.props.citizenId}
                    phone={this.props.phone}
                    passportNumber={this.props.passportNumber}
                    salary={this.props.salary}
                    onChangeHandler={this.props.changeEvent}
                    onSubmitHandler={this.onSubmitHandler}
                    updateHandler={this.updateHandler}
                    cancelHandler={this.props.cancel}
                    updateEvent={this.props.updateEvent}
                    nationalityList={this.props.nationalityList}
                />
                <CrudPagination 
                    numberOfUsers={this.props.users.length}
                    numberOfUsersOnePage={this.props.numberOfUsersOnePage}
                    selectPage={this.props.selectPage}
                />
                <CrudTable 
                    users={this.props.users}
                    fetchUpdateHandler={this.props.fetchOneUser}
                    deleteHandler={this.deleteHandler}
                    startElement={this.props.startElement}
                />
                <ToastContainer autoClose={4000} hideProgressBar/>
            </div>
        )
    }
}

Crud.propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    fetchOneUser: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    changeEvent: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    getNationality: PropTypes.func.isRequired,
    selectPage: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
    users: state.users.users,
    id: state.users.id,
    title: state.users.title,
    firstName: state.users.firstName,
    lastName: state.users.lastName,
    birthday: state.users.birthday,
    nationality: state.users.nationality,
    citizenId: state.users.citizenId,
    gender: state.users.gender,
    phone: state.users.phone,
    passportNumber: state.users.passportNumber,
    salary: state.users.salary,
    updateEvent: state.users.updateEvent,
    nationalityList: state.info.nationality,
    startElement: state.pagination.startElement,
    numberOfUsersOnePage: state.pagination.numberOfUsersOnePage
});

export default connect(mapStateToProps, { fetchUsers, createUser, deleteUser, cancel, fetchOneUser, changeEvent, updateUser, getNationality, selectPage })(Crud);
