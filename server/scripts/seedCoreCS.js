const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const Topic = require(path.join(__dirname, '..', 'models', 'Topic'));

const coreCSTopics = [
    {
        category: 'core-cs',
        name: 'Object Oriented Programming (OOPS)',
        description: 'Master the principles of OOPs like Abstraction, Encapsulation, Inheritance, and Polymorphism.',
        content: `
# Object Oriented Programming (OOPS)

Object-Oriented Programming is a paradigm based on the concept of "objects", which can contain data and code.

## 1. Class and Object
- **Class**: A blueprint or template for creating objects.
- **Object**: An instance of a class.

## 2. The Four Pillars of OOPS
### 1. Abstraction
Hiding complex implementation details and showing only the necessary features.
*Example*: You know how to use a TV remote (interface) without knowing the internal circuitry (implementation).

### 2. Encapsulation
Wrapping data (variables) and code (methods) together as a single unit. It uses access modifiers (private, public, protected).

### 3. Inheritance
The mechanism by which one class acquires the properties and behaviors of another class.
- **Single**: A -> B
- **Multiple**: (A, B) -> C (Supported in C++, but via Interfaces in Java)
- **Multilevel**: A -> B -> C

### 4. Polymorphism
The ability of a message or function to be displayed in more than one form.
- **Compile-time**: Method Overloading.
- **Runtime**: Method Overriding.
        `,
        examples: [
            {
                question: 'What is the main difference between Method Overloading and Method Overriding?',
                solution: 'Overloading happens in the **same class** with different signatures (compile-time). Overriding happens in **different classes** (Parent-Child) with the same signature (runtime).',
                difficulty: 'easy'
            },
            {
                question: 'How is Abstraction different from Encapsulation?',
                solution: 'Abstraction is about **hiding implementation**, while Encapsulation is about **hiding data** (binding it with code).',
                difficulty: 'medium'
            }
        ]
    },
    {
        category: 'core-cs',
        name: 'Operating Systems (OS)',
        description: 'Understand Process management, Threads, Memory Management, and Deadlocks.',
        content: `
# Operating Systems (OS)

An OS is software that acts as an interface between computer hardware and the user.

## 1. Process vs Thread
- **Process**: A program in execution. It has its own memory space.
- **Thread**: A subset of a process. Threads share the same memory space.

## 2. Scheduling Algorithms
- **First Come First Serve (FCFS)**: Non-preemptive.
- **Shortest Job First (SJF)**: Minimizes average waiting time.
- **Round Robin**: Time-slicing (preemptive FCFS).

## 3. Deadlock
A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process.
**Four Necessary Conditions (Coffman Conditions):**
1. Mutual Exclusion
2. Hold and Wait
3. No Preemption
4. Circular Wait

## 4. Virtual Memory & Paging
- **Paging**: Dividing logical memory into blocks of the same size called pages.
- **Virtual Memory**: Allows execution of processes that are not completely in memory.
        `,
        examples: [
            {
                question: 'What are the 4 conditions for a Deadlock to occur?',
                solution: '1. Mutual Exclusion, 2. Hold & Wait, 3. No Preemption, 4. Circular Wait.',
                difficulty: 'easy'
            }
        ]
    },
    {
        category: 'core-cs',
        name: 'Database Management Systems (DBMS)',
        description: 'Learn about SQL, NoSQL, Normalization, ACID properties, and Indexing.',
        content: `
# Database Management Systems (DBMS)

## 1. ACID Properties
Ensures reliable transaction processing:
- **Atomicity**: All or nothing.
- **Consistency**: Database stays in a valid state.
- **Isolation**: Concurrent transactions don't interfere.
- **Durability**: Once committed, data is permanent.

## 2. Normalization
The process of organizing data to reduce redundancy:
- **1NF**: Atomic values.
- **2NF**: No partial dependency.
- **3NF**: No transitive dependency.

## 3. SQL vs NoSQL
- **SQL**: Relational, structured (Schema), table-based (e.g., MySQL, PostgreSQL).
- **NoSQL**: Non-relational, unstructured, document/key-value based (e.g., MongoDB, Redis).

## 4. Indexing
A technique to optimize performance by reducing disk I/O when searching for data.
        `,
        examples: [
            {
                question: 'What is 3rd Normal Form (3NF)?',
                solution: 'A relation is in 3NF if it is in 2NF and there are no **transitive dependencies** (A -> B -> C).',
                difficulty: 'medium'
            }
        ]
    },
    {
        category: 'core-cs',
        name: 'Computer Networks (CN)',
        description: 'Dive into the OSI Model, TCP/IP, DNS, and HTTP/S protocols.',
        content: `
# Computer Networks (CN)

## 1. OSI Model (7 Layers)
1. Physical
2. Data Link
3. Network (IP)
4. Transport (TCP/UDP)
5. Session
6. Presentation
7. Application (HTTP, DNS)

## 2. TCP vs UDP
- **TCP**: Connection-oriented, reliable, error-checking (e.g., Web browsing).
- **UDP**: Connectionless, fast, no reliability (e.g., Streaming, VoIP).

## 3. DNS (Domain Name System)
Translates human-readable names (google.com) into IP addresses (142.250.xxx.xxx).

## 4. HTTP vs HTTPS
HTTPS is HTTP with **TLS/SSL encryption** to provide secure communication over port 443.
        `,
        examples: [
            {
                question: 'Which layer of the OSI model does a Router operate on?',
                solution: 'A router operates on the **Network Layer (Layer 3)**.',
                difficulty: 'easy'
            }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        for (const topic of coreCSTopics) {
            await Topic.findOneAndUpdate(
                { name: topic.name },
                topic,
                { upsert: true, new: true }
            );
        }

        console.log('Core CS topics seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
