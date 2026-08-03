package com.interpreter.exon;

import java.util.List;

public class AstPrinter implements Expr.Visitor<String>, Stmt.Visitor<String> {
    
    public String print(List<Stmt> statements) {
        StringBuilder sb = new StringBuilder();
        for (Stmt stmt : statements) {
            sb.append(stmt.accept(this)).append("\n");
        }
        return sb.toString().trim();
    }

    public String print(Expr expr) {
        return expr.accept(this);
    }

    @Override
    public String visitBinaryExpr(Expr.Binary expr) {
        return parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    @Override
    public String visitAssignExpr(Expr.Assign expr) {
        return parenthesize("= " + expr.name.lexeme, expr.value);
    }

    @Override
    public String visitCallExpr(Expr.Call expr) {
        return parenthesize("call " + expr.callee.accept(this), expr.arguments.toArray(new Expr[0]));
    }

    @Override
    public String visitVariableExpr(Expr.Variable expr) {
        return expr.name.lexeme;
    }

    @Override
    public String visitLogicalExpr(Expr.Logical expr) {
        return parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    @Override
    public String visitGetExpr(Expr.Get expr) {
        return "(get " + expr.object.accept(this) + " ." + expr.name.lexeme + ")";
    }

    @Override
    public String visitSetExpr(Expr.Set expr) {
        return "(set-field " + expr.object.accept(this) + " ." + expr.name.lexeme + " " + expr.value.accept(this) + ")";
    }

    @Override
    public String visitGroupingExpr(Expr.Grouping expr) {
        return parenthesize("group", expr.expression);
    }

    @Override
    public String visitThisExpr(Expr.This expr) {
        return "this";
    }
    
    @Override
    public String visitSuperExpr(Expr.Super expr) {
        return "(super " + expr.method.lexeme + ")";
    }

    @Override
    public String visitLiteralExpr(Expr.Literal expr) {
        if (expr.value == null) return "nil";
        return expr.value.toString();
    }

    @Override
    public String visitUnaryExpr(Expr.Unary expr) {
        return parenthesize(expr.operator.lexeme, expr.right);
    }

    // Statement visitors
    @Override
    public String visitBlockStmt(Stmt.Block stmt) {
        StringBuilder builder = new StringBuilder("(block");
        for (Stmt s : stmt.statements) {
            builder.append(" ").append(s.accept(this));
        }
        builder.append(")");
        return builder.toString();
    }

    @Override
    public String visitClassStmt(Stmt.Class stmt) {
        StringBuilder builder = new StringBuilder("(class ").append(stmt.name.lexeme);
        if (stmt.superclass != null) {
            builder.append(" < ").append(stmt.superclass.name.lexeme);
        }
        builder.append(")");
        return builder.toString();
    }

    @Override
    public String visitExpressionStmt(Stmt.Expression stmt) {
        return stmt.expression.accept(this);
    }

    @Override
    public String visitFunctionStmt(Stmt.Function stmt) {
        return "(fxn " + stmt.name.lexeme + ")";
    }

    @Override
    public String visitIfStmt(Stmt.If stmt) {
        if (stmt.elseBranch == null) {
            return "(if " + stmt.condition.accept(this) + " " + stmt.thenBranch.accept(this) + ")";
        }
        return "(if " + stmt.condition.accept(this) + " " + stmt.thenBranch.accept(this) + " " + stmt.elseBranch.accept(this) + ")";
    }

    @Override
    public String visitOutStmt(Stmt.Out stmt) {
        return "(out " + stmt.expression.accept(this) + ")";
    }

    @Override
    public String visitReturnStmt(Stmt.Return stmt) {
        if (stmt.value == null) return "(return)";
        return "(return " + stmt.value.accept(this) + ")";
    }

    @Override
    public String visitSetStmt(Stmt.Set stmt) {
        if (stmt.initializer == null) return "(var " + stmt.name.lexeme + ")";
        return "(var " + stmt.name.lexeme + " = " + stmt.initializer.accept(this) + ")";
    }

    @Override
    public String visitWhenStmt(Stmt.When stmt) {
        return "(when " + stmt.condition.accept(this) + " " + stmt.body.accept(this) + ")";
    }

    private String parenthesize(String name, Expr... exprs) {
        StringBuilder builder = new StringBuilder();
        builder.append("(").append(name);
        for (Expr expr : exprs) {
            builder.append(" ");
            builder.append(expr.accept(this));
        }
        builder.append(")");
        return builder.toString();
    }
}
