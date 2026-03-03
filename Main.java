// i am implemeting multilevel Inheritance in this code;

class Animal {
    void eat() {
        System.out.println("Eating....");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("Barking....");
    }
}

class BabyDog extends Dog {
    void weep() {
        System.out.println("Weeping....");
    }
}

public class Main {
    public static void main(String[] args){
        BabyDog d = new BabyDog();
        d.eat();
        d.bark();
        d.weep();

        // this is an example of multilevel inheritance where BabyDog class inherits from Dog class and Dog class inherits from Animal class. So, BabyDog class can access the methods of both Dog and Animal classes.
    }
}