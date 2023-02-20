import jwt from 'jsonwebtoken';

async function authMiddleware(req, res, next) {
    try {
        if (!req.cookies['jwttoken']) {
            throw "NOT AUTHENTICATED";
        }
        let user = jwt.verify(req.cookies['jwttoken'], process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "JWT Not Authenticated" });
    }
}


async function setCSRFCookie(req, res, next) {
    try {
        if (req.cookies['csrftoken']) {
            jwt.verify(req.cookies['csrftoken'], process.env.JWT_SECRET);
        } else {
            throw 'No csrf token';
        }
    } catch (err) {
        let csrfToken = jwt.sign({ rand: Math.random() }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '60m' });
        res.cookie('csrftoken', csrfToken, {
            maxAge: 1000 * 60 * 60,
        });
    }
    next();
}

async function csrfMiddleWare(req, res, next) {
    try {
        if (!req.headers['authorization']) {
            throw "NOT AUTHENTICATED";
        }
        jwt.verify(req.headers['authorization'], process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ message: "CSRF Not Authenticated" });
    }
}

async function adminOnly(req, res, next) {
    if (req.user.type == "admin") {
        next();
    } else {
        res.status(401).json({ message: "Not Admin" });
    }
}
async function staffOnly(req, res, next) {
    if (req.user.type == "admin" || req.user.type == "staff") {
        next();
    } else {
        res.status(401).json({ message: "Not Admin" });
    }
}
async function customerOnly(req, res, next) {
    if (req.user.type == "customer") {
        next();
    } else {
        res.status(401).json({ message: "Not Admin" });
    }
}

//async function adminUserCheck(req, res, next) {
//try {
//if (!req.user) {
//throw "NOT AUTHENTICATED";
//}
//if(req.user.type != "admin"){
//throw "NOT AUTHENTICATED";
//}
//next();
//} catch (err) {
//res.status(401).json({message: "Not Authenticated" });
//}
//}

export { authMiddleware, setCSRFCookie, csrfMiddleWare, adminOnly, staffOnly, customerOnly };
