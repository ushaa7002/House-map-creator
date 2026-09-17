#include <iostream>
using namespace std;

class Node {
public:
    int data;
    Node* next;

    // Constructor
    Node(int data) {
        this->data = data;
        this->next = NULL;
    }
};

// Insert a node at the head
void InsertAtHead(Node* &head, int d) {
    // Create a new node
    Node* temp = new Node(d);

    // Point new node to current head
    temp->next = head;

    // Make new node the head
    head = temp;
}

// Print the linked list
void print(Node* &head) {
    Node* temp = head;

    while (temp != NULL) {
        cout << temp->data << " ";
        temp = temp->next;
    }

    cout << endl;
}

int main() {
    Node* node1 = new Node(10);

    cout << node1->data << endl;
    cout << node1->next << endl;

    // Head points to node1
    Node* head = node1;

    print(head);

    InsertAtHead(head, 12);

    print(head);
    InsertAtHead(head,15);
    print(head);

    return 0;
}