var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var UserSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    role:{
        type:Number,
        default:0
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});


UserSchema.pre('save',function(next){
    var user = this;
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else{
        this.meta.updateAt = Date.now()
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });

});
UserSchema.methods = {
    compareParssword:function(_password,cb){
        bcrypt.compare(_password,this.password,function(err,isMath){
            if(err){
               return cb(err);
            }
            cb(null,isMath);

        })
    }
};

UserSchema.statics = {
    fetch:function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findeById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)
    }
};

module.exports = UserSchema;