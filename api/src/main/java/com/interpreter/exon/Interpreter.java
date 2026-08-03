package com.interpreter.exon;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

import com.interpreter.exon.Expr.Assign;
import com.interpreter.exon.Expr.Binary;
import com.interpreter.exon.Expr.Call;
import com.interpreter.exon.Expr.Get;
import com.interpreter.exon.Expr.Grouping;
import com.interpreter.exon.Expr.Literal;
import com.interpreter.exon.Expr.Logical;
import com.interpreter.exon.Expr.Set;
import com.interpreter.exon.Expr.Super;
import com.interpreter.exon.Expr.This;
import com.interpreter.exon.Expr.Unary;
import com.interpreter.exon.Stmt.Block;
import com.interpreter.exon.Stmt.Class;
import com.interpreter.exon.Stmt.Function;
import com.interpreter.exon.Stmt.If;
import com.interpreter.exon.Stmt.When;
import com.interpreter.exon.Stmt.Return;

public class Interpreter implements Expr.Visitor<Object>, Stmt.Visitor<Void> {

    final Environment globals = new Environment();
    private Environment environment = globals;
    private final Map<Expr, Integer> locals = new HashMap<>();
    private final OutputCollector output;
    private final ErrorCollector errors;

    public Interpreter(OutputCollector output, ErrorCollector errors) {
        this.output = output;
        this.errors = errors;

        // Native: clock() — returns Unix time in seconds
        globals.define("clock", new ExonCallable() {
            @Override public int arity() { return 0; }
            @Override public Object call(Interpreter interpreter, List<Object> arguments) {
                return (double) System.currentTimeMillis() / 1000.0;
            }
            @Override public String toString() { return "<native fn>"; }
        });

        // Native: len(value) — returns length of a string as a number
        globals.define("len", new ExonCallable() {
            @Override public int arity() { return 1; }
            @Override public Object call(Interpreter interpreter, List<Object> arguments) {
                Object arg = arguments.get(0);
                if (arg instanceof String s) return (double) s.length();
                throw new RuntimeError(new Token(TokenType.IDENTIFIER, "len", null, 0),
                    "len() requires a string argument.");
            }
            @Override public String toString() { return "<native fn>"; }
        });

        // Native: str(value) — converts any value to its string representation
        globals.define("str", new ExonCallable() {
            @Override public int arity() { return 1; }
            @Override public Object call(Interpreter interpreter, List<Object> arguments) {
                return stringify(arguments.get(0));
            }
            @Override public String toString() { return "<native fn>"; }
        });

        // Native: type(value) — returns the type name as a string
        globals.define("type", new ExonCallable() {
            @Override public int arity() { return 1; }
            @Override public Object call(Interpreter interpreter, List<Object> arguments) {
                Object arg = arguments.get(0);
                if (arg == null)                 return "nil";
                if (arg instanceof Boolean)       return "boolean";
                if (arg instanceof Double)        return "number";
                if (arg instanceof String)        return "string";
                if (arg instanceof ExonClass)     return "class";
                if (arg instanceof ExonInstance)  return "instance";
                if (arg instanceof ExonCallable)  return "function";
                return "unknown";
            }
            @Override public String toString() { return "<native fn>"; }
        });
    }

    void interpret(List<Stmt> statements) {
        try {
            for (Stmt statement : statements) {
                execute(statement);
            }
        } catch (RuntimeError error) {
            errors.runtimeError(error);
        } catch (OutputCollector.OutputLimitExceededException e) {
            errors.runtimeError(new RuntimeError(
                new Token(TokenType.IDENTIFIER, "out", null, 0),
                e.getMessage()
            ));
        }
    }

    @Override
    public Object visitLiteralExpr(Literal expr) {
        return expr.value;
    }

    @Override
    public Void visitIfStmt(If stmt) {
        if (isTruthy(evaluate(stmt.condition))) {
            execute(stmt.thenBranch);
        } else if (stmt.elseBranch != null) {
            execute(stmt.elseBranch);
        }
        return null;
    }

    @Override
    public Object visitGroupingExpr(Grouping expr) {
        return evaluate(expr.expression);
    }

    private Object evaluate(Expr expr) {
        return expr.accept(this);
    }

    private void execute(Stmt stmt) {
        stmt.accept(this);
    }

    void resolve(Expr expr, int depth) {
        locals.put(expr, depth);
    }

    @Override
    public Object visitLogicalExpr(Logical expr) {
        Object left = evaluate(expr.left);
        if (expr.operator.type == TokenType.OR) {
            if (isTruthy(left))
                return left;
        } else {
            if (!isTruthy(left))
                return left;
        }
        return evaluate(expr.right);
    }

    @Override
    public Void visitWhenStmt(When stmt) {
        while (isTruthy(evaluate(stmt.condition))) {
            execute(stmt.body);
        }
        return null;
    }

    @Override
    public Void visitBlockStmt(Block stmt) {
        executeBlock(stmt.statements, new Environment(environment));
        return null;
    }

    void executeBlock(List<Stmt> statements, Environment environment) {
        Environment previous = this.environment;
        try {
            this.environment = environment;
            for (Stmt statement : statements) {
                execute(statement);
            }
        } finally {
            this.environment = previous;
        }
    }

    @Override
    public Void visitExpressionStmt(Stmt.Expression stmt) {
        evaluate(stmt.expression);
        return null;
    }

    @Override
    public Void visitFunctionStmt(Function stmt) {
        ExonFunction function = new ExonFunction(stmt, environment, false);
        environment.define(stmt.name.lexeme, function);
        return null;
    }

    @Override
    public Void visitOutStmt(Stmt.Out stmt) {
        Object value = evaluate(stmt.expression);
        output.println(stringify(value));
        return null;
    }

    @Override
    public Void visitReturnStmt(Return stmt) {
        Object value = null;
        if (stmt.value != null)
            value = evaluate(stmt.value);
        throw new com.interpreter.exon.Return(value);
    }

    @Override
    public Void visitSetStmt(Stmt.Set stmt) {
        Object value = null;
        if (stmt.initializer != null) {
            value = evaluate(stmt.initializer);
        }
        environment.define(stmt.name.lexeme, value);
        return null;
    }

    @Override
    public Object visitAssignExpr(Assign expr) {
        Object value = evaluate(expr.value);
        
        Integer distance = locals.get(expr);
        if (distance != null) {
            environment.assignAt(distance, expr.name, value);
        } else {
            globals.assign(expr.name, value);
        }

        return value;
    }

    @Override
    public Object visitVariableExpr(Expr.Variable expr) {
        return lookUpVariable(expr.name, expr);
    }

    private Object lookUpVariable(Token name, Expr expr) {
        Integer distance = locals.get(expr);
        if (distance != null) {
            return environment.getAt(distance, name.lexeme);
        } else {
            return globals.get(name);
        }
    }

    @Override
    public Object visitUnaryExpr(Unary expr) {
        Object right = evaluate(expr.right);
        switch (expr.operator.type) {
            case BANG:
                return !isTruthy(right);
            case MINUS:
                checkNumberOperand(expr.operator, right);
                return -(double) right;
        }
        return null;
    }

    private boolean isTruthy(Object object) {
        if (object == null)
            return false;
        if (object instanceof Boolean)
            return (boolean) object;
        return true;
    }

    @Override
    public Object visitBinaryExpr(Binary expr) {
        Object left = evaluate(expr.left);
        Object right = evaluate(expr.right);

        switch (expr.operator.type) {
            case GREATER:
                checkNumberOperands(expr.operator, left, right);
                return (double) left > (double) right;
            case GREATER_EQUAL:
                checkNumberOperands(expr.operator, left, right);
                return (double) left >= (double) right;
            case LESS:
                checkNumberOperands(expr.operator, left, right);
                return (double) left < (double) right;
            case LESS_EQUAL:
                checkNumberOperands(expr.operator, left, right);
                return (double) left <= (double) right;
            case BANG_EQUAL:
                return !isEqual(left, right);
            case EQUAL_EQUAL:
                return isEqual(left, right);

            case MINUS:
                checkNumberOperands(expr.operator, left, right);
                return (double) left - (double) right;
            case PLUS:
                if (left instanceof Double && right instanceof Double)
                    return (double) left + (double) right;
                if (left instanceof String && right instanceof String)
                    return (String) left + (String) right;
                throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings.");

            case SLASH:
                checkNumberOperands(expr.operator, left, right);
                return (double) left / (double) right;
            case STAR:
                checkNumberOperands(expr.operator, left, right);
                return (double) left * (double) right;
        }
        return null;
    }

    @Override
    public Object visitCallExpr(Call expr) {
        Object callee = evaluate(expr.callee);

        List<Object> arguments = new ArrayList<>();
        for (Expr argument : expr.arguments) {
            arguments.add(evaluate(argument));
        }

        if (!(callee instanceof ExonCallable)) {
            throw new RuntimeError(expr.paren, "Can only call functions and classes.");
        }

        ExonCallable function = (ExonCallable) callee;
        if (arguments.size() != function.arity()) {
            throw new RuntimeError(expr.paren,
                    "Expected " + function.arity() + " arguments but got  " + arguments.size() + ".");
        }
        return function.call(this, arguments);
    }
    @Override
    public Void visitClassStmt(Class stmt) {
        Object superclass = null;
        if (stmt.superclass != null) {
            superclass = evaluate(stmt.superclass);
            if (!(superclass instanceof ExonClass)) {
                throw new RuntimeError(stmt.superclass.name, "Superclass must be a class.");
            }
        }
        environment.define(stmt.name.lexeme, null);

        if (stmt.superclass != null) {
            environment = new Environment(environment);
            environment.define("super", superclass);
        }

        Map<String, ExonFunction> methods = new HashMap<>();
        for (Stmt.Function method : stmt.methods) {
            ExonFunction function = new ExonFunction(method, environment, method.name.lexeme.equals("init"));
            methods.put(method.name.lexeme, function);
        }
        ExonClass klass = new ExonClass(stmt.name.lexeme, (ExonClass) superclass, methods);

        if (superclass != null) {
            environment = environment.enclosing;
        }

        environment.assign(stmt.name, klass);
        return null;
    }

    @Override
    public Object visitSuperExpr(Super expr) {
        int distance = locals.get(expr);
        ExonClass superclass = (ExonClass) environment.getAt(distance, "super");
        ExonInstance object = (ExonInstance) environment.getAt(distance - 1, "this");
        ExonFunction method = superclass.findMethod(expr.method.lexeme);

        if (method == null)
            throw new RuntimeError(expr.method, "Undefined property '" + expr.method.lexeme + "'.");

        return method.bind(object);
    }

    @Override
    public Object visitGetExpr(Get expr) {
        Object object = evaluate(expr.object);
        if (object instanceof ExonInstance) {
            return ((ExonInstance) object).get(expr.name);
        }

        throw new RuntimeError(expr.name, "Only instances have properties.");
        
    }

    @Override
    public Object visitSetExpr(Set expr) {
        Object object = evaluate(expr.object);
        if (!(object instanceof ExonInstance)) {
            throw new RuntimeError(expr.name, "Only instance have fields.");
        }
        Object value = evaluate(expr.value);
        ((ExonInstance) object).set(expr.name, value);
        return value;
    }

    @Override
    public Object visitThisExpr(This expr) {
        return lookUpVariable(expr.keyword, expr);
    }


    private boolean isEqual(Object a, Object b) {
        if (a == null && b == null)
            return true;
        if (a == null)
            return false;
        return a.equals(b);
    }

    private String stringify(Object object) {
        if (object == null)
            return "nil";
        if (object instanceof Double) {
            String text = object.toString();
            if (text.endsWith(".0")) {
                text = text.substring(0, text.length() - 2);
            }
            return text;
        }
        return object.toString();
    }

    // !Runtime Error check for the expression

    private void checkNumberOperand(Token operator, Object operand) {
        if (operand instanceof Double)
            return;
        throw new RuntimeError(operator, "Operand must be a number.");
    }

    private void checkNumberOperands(Token operator, Object left, Object right) {
        if (left instanceof Double && right instanceof Double)
            return;
        throw new RuntimeError(operator, "Operand must be a number.");
    }

}
