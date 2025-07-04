const User = require("../Model/UserModel");
// data display
const getAllUsers = async (req, res, next) => {
    let users;

    try {
        users = await User.find();
    } catch (err) {
        console.log(err);
    }

    if (!users) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ users });
};
//data intsert
const addUsers = async (req, res, next) => {


    const { name, gmail, age, address } = req.body;

    let users;

    try {
        users = new User({ name, gmail, age, address });
        await users.save();
    } catch (error) {
        console.log(error);
    }
    // not insert users
    if (!users) {
        return res.status(404).json({ message: "unable to add users" });
    }
    return res.status(200).json({ users });
};

//Get By Id
const getById = async (req, res, next) => {


    const id = req.params.id;

    let users;

    try {
        users = await User.findById(id);
    } catch (error) {
        console.log(error);
    }
    // not available users
    if (!users) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ users });
};

// Update user details

const updateUser = async (req, res, next) => {


    const id = req.params.id;
    const { name, gmail, age, address } = req.body;
    let users;

    try {
        users = await User.findByIdAndUpdate(id, { name: name, gmail: gmail, age: age, address: address });
        users = await users.save();
    } catch (error) {
        console.log(error);
    }
    // not available users
    if (!users) {
        return res.status(404).json({ message: "Unable to update user details" });
    }

    return res.status(200).json({ users });
};

const deleteUser = async (req, res, next) => {


    const id = req.params.id;

    let user;

    try {
        user = await User.findByIdAndDelete(id);
    } catch (error) {
        console.log(error);
    }
    // not available users
    if (!user) {
        return res.status(404).json({ message: "Unable to delete user details" });
    }

    return res.status(200).json({ user });
};

exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.getById = getById;
exports.addUsers = addUsers;
exports.getAllUsers = getAllUsers;