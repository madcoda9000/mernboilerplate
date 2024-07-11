import hbs from "nodemailer-express-handlebars";
import path from "path";

export const handlebarsConfig = {
  viewEngine: {
    partialsDir: path.resolve("./mailTemplates/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./mailTemplates/"),
};
