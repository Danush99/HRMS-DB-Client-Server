const users = require('../database/users');
const getData = require('../database/getData');
const validator = require("../validation/validation");

const viewUser = async (req,res)=>{
    user = await users.getEmployee(req.params.user_id);
    phoneNums = await users.getPhoneNoByEmpId(user.values[0].empId);
    console.log(phoneNums);
    if (user.values.length >= 1){
        console.log("User found");
        return res.status(201).json({
            message: "User " + req.params.user_id + " found",
            data: {...user.values[0], "phone1": phoneNums.values[0].phone_number, "phone2":phoneNums.values[1].phone_number}
        });
    } else {
        return res.status(400).json({
            message: "Cannot find the user"
        });
    }
}

const getUserList = async (req,res)=>{
    user = await users.getEmployeeList();

    if (user.values.length >= 1){
        console.log("Users found");
        return res.status(201).json({
            message: "Users found",
            data: user.values
        });
    } else {
        return res.status(400).json({
            message: "Cannot find users"
        });
    }
}

const editUser = async (req,res)=>{
    const validation_result = validator.employee_update(req);

    if (validation_result.status) {
        console.log("Validation error", validation_result.message)
        return res.status(400).json({
          message: validation_result.message,
        });
    }
    
    department = await getData.getDepartmentById(req.body.dept_id);
    if (department.values.length < 1){
        console.log("Department does not exists");
        return res.status(400).json({
            message: "Department does not exists"
        });
    }

    emptype = await getData.getEmpTypeById(req.body.emptype_id);
    if (emptype.values.length < 1){
        console.log("Employee Type does not exists");
        return res.status(400).json({
            message: "Employee Type does not exists"
        });
    } else if((emptype.values[0].type == "HR Manager") || (emptype.values[0].type == "Admin")) {
        console.log("Invalid employee type");
        return res.status(400).json({
            message: "Invalid employee type"
        });
    }

    maritalstatus = await getData.getMaritalStatusById(req.body.marital_id);
    if (maritalstatus.values.length < 1){
        console.log("Invalid marital status");
        return res.status(400).json({
            message: "Invalid marital status"
        });
    }

    paygrade = await getData.getPayGradeById(req.body.paygrade_id);
    if (paygrade.values.length < 1){
        console.log("Invalid pay grade");
        return res.status(400).json({
            message: "Invalid pay grade"
        });
    }

    empstatus = await getData.getEmpStatusById(req.body.empstatus_id);
    if (empstatus.values.length < 1){
        console.log("Invalid employee status");
        return res.status(400).json({
            message: "Invalid employee status"
        });
    }

    // const rupdateStatus = users.updateUser(req);
    // if (rupdateStatus.status === true){
    //     console.log("Successfully updated user details");
    //     return res.status(201).json({
    //         message: "Successfully updated user details"
    //     });
    // }else{
    //     console.log("User details update failed");
    //     return res.status(201).json({
    //         message: "User details update failed"
    //     });
    // }
    // console.log("*******************", req.body);
}

module.exports = {
    viewUser,
    getUserList,
    editUser
}