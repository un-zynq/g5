Array.prototype.pushAll$ = function(t) {
    t && (t instanceof Array ? this.push.apply(this, t) : console.error("参数items必须为数组类型"));
}, Array.prototype.insert$ = function(t, r) {
    this.splice(t, 0, r);
}, Array.prototype.remove$ = function(t) {
    for (var r = this.length - 1; r >= 0; r--) this[r] == t && this.splice(r, 1);
}, Array.prototype.removeAt$ = function(t) {
    var r = this[t];
    return this.splice(t, 1), r;
}, Array.prototype.removeAll$ = function() {
    this.length = 0;
}, Array.prototype.contains$ = function(t) {
    return -1 != this.indexOf(t);
}, Array.prototype.last$ = function() {
    return this[this.length - 1];
}, Array.prototype.isEmpty$ = function() {
    return 0 == this.length;
}, Array.prototype.clone$ = function() {
    let t, r = [], e = this.length;
    for (t = 0; t < e; t++) r.push(this[t]);
    return r;
}, String.prototype.startWith$ = function(t) {
    var r = "^" + t, e = Laya.Pool.getItem(r, RegExp);
    null == e && (e = new RegExp(r));
    var o = e.test(this);
    return Laya.Pool.recover(r, e), o;
}, String.prototype.endWith$ = function(t) {
    var r = t + "$", e = Laya.Pool.getItem(r, RegExp);
    null == e && (e = new RegExp(r));
    var o = e.test(this);
    return Laya.Pool.recover(r, e), o;
}, String.prototype.replaceAll$ = function(t, r) {
    return this.split(t).join(r);
}, String.prototype.contains$ = function(t) {
    return -1 != this.indexOf(t);
};