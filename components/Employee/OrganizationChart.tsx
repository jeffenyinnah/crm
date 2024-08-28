"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChartNode {
  id: string;
  name: string;
  title: string;
  parentId: string | null;
  children: ChartNode[];
}

const OrganizationChart = () => {
  const [chartData, setChartData] = useState<ChartNode | null>(null);
  const [editingNode, setEditingNode] = useState<ChartNode | null>(null);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const response = await fetch("/api/organization-chart");
      if (!response.ok) {
        throw new Error("Failed to fetch organization chart data");
      }
      const data = await response.json();
      setChartData(buildHierarchy(data));
    } catch (error) {
      console.error("Error fetching organization chart:", error);
      alert("Error fetching organization chart. Please try again.");
    }
  };

  const buildHierarchy = (data: any[]): ChartNode => {
    const idMap = new Map(
      data.map((item) => [item.id, { ...item, children: [] }])
    );
    let root = null;

    for (const item of idMap.values()) {
      if (item.parentId) {
        const parent = idMap.get(item.parentId);
        if (parent) {
          parent.children.push(item);
        }
      } else {
        root = item;
      }
    }

    return root;
  };

  const addNode = async (parentId: string | null) => {
    try {
      const newNode = {
        name: "New Employee",
        title: "New Position",
        parentId: parentId,
      };
      const response = await fetch("/api/organization-chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNode),
      });
      if (!response.ok) {
        throw new Error("Failed to add node");
      }
      fetchChartData();
    } catch (error) {
      console.error("Error adding node:", error);
      alert("Error adding node. Please try again.");
    }
  };

  const updateNode = async (node: ChartNode) => {
    try {
      const response = await fetch(`/api/organization-chart/${node.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: node.name,
          title: node.title,
          parentId: node.parentId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update node");
      }
      setEditingNode(null);
      fetchChartData();
    } catch (error) {
      console.error("Error updating node:", error);
      alert("Error updating node. Please try again.");
    }
  };

  const deleteNode = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this node and all its children?"
      )
    ) {
      try {
        const response = await fetch(`/api/organization-chart/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete node");
        }
        fetchChartData();
      } catch (error) {
        console.error("Error deleting node:", error);
        alert("Error deleting node. Please try again.");
      }
    }
  };

  const renderNode = (node: ChartNode) => (
    <div key={node.id} className="border p-4 m-2">
      {editingNode && editingNode.id === node.id ? (
        <div>
          <Input
            value={editingNode.name}
            onChange={(e) =>
              setEditingNode({ ...editingNode, name: e.target.value })
            }
            className="mb-2"
          />
          <Input
            value={editingNode.title}
            onChange={(e) =>
              setEditingNode({ ...editingNode, title: e.target.value })
            }
            className="mb-2"
          />
          <Button onClick={() => updateNode(editingNode)} className="mr-2">
            Save
          </Button>
          <Button onClick={() => setEditingNode(null)} variant="outline">
            Cancel
          </Button>
        </div>
      ) : (
        <div>
          <h3 className="font-bold">{node.name}</h3>
          <p>{node.title}</p>
          <Button onClick={() => setEditingNode(node)} className="mr-2">
            Edit
          </Button>
          <Button
            onClick={() => deleteNode(node.id)}
            variant="destructive"
            className="mr-2"
          >
            Delete
          </Button>
          <Button onClick={() => addNode(node.id)}>Add Child</Button>
        </div>
      )}
      {node.children.length > 0 && (
        <div className="ml-8">
          {node.children.map((child) => renderNode(child))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Organization Chart</h2>
      <Button onClick={() => addNode(null)} className="mb-4">
        Add Root Node
      </Button>
      {chartData && renderNode(chartData)}
    </div>
  );
};

export default OrganizationChart;
